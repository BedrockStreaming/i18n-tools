// eslint-disable-next-line no-underscore-dangle
const _get = require('lodash/get');
const { getKeyValue, get, has, getLangConfig, getTranslateParams, isFileIgnored } = require('../utils/utils');

const check = ({ key, countNode, config, langsKey, context, node, translateParams }) => {
  getLangConfig(config, langsKey).forEach(({ name, translation }) => {
    if (!translation) {
      context.report({
        node,
        severity: 2,
        message: `'${name}' language is missing`,
      });

      return;
    }

    // Détecter si la clé a des variantes pluralisées (react-i18next format)
    // Chercher dans la structure imbriquée
    const keyParts = key.split('.');
    const parentPath = keyParts.slice(0, -1).join('.');
    const baseKey = keyParts[keyParts.length - 1];

    let hasPluralizedVariants = false;
    let availableVariants = [];
    let keyExistsAsSimpleValue = false;

    if (parentPath) {
      // Clé imbriquée : chercher dans l'objet parent
      const parentObject = get(translation, parentPath);
      if (parentObject && typeof parentObject === 'object') {
        const parentKeys = Object.keys(parentObject);

        // Vérifier si la clé existe comme valeur simple dans le contexte parent
        keyExistsAsSimpleValue = parentKeys.includes(baseKey) && typeof parentObject[baseKey] === 'string';

        // Vérifier si on a des variantes pluralisées pour cette clé spécifique dans le même contexte
        hasPluralizedVariants = parentKeys.some(
          translationKey => translationKey.startsWith(`${baseKey}_`) && translationKey !== baseKey,
        );

        if (hasPluralizedVariants) {
          availableVariants = parentKeys
            .filter(translationKey => translationKey.startsWith(`${baseKey}_`))
            .map(translationKey => translationKey.substring(baseKey.length + 1));
        }
      }
    } else {
      // Clé de niveau racine : chercher seulement les variantes de cette clé exacte
      const rootKeys = Object.keys(translation);

      // Vérifier si la clé existe comme valeur simple au niveau racine
      keyExistsAsSimpleValue = has(translation, key) && typeof get(translation, key) === 'string';

      hasPluralizedVariants = rootKeys.some(
        translationKey => translationKey.startsWith(`${key}_`) && translationKey !== key,
      );

      if (hasPluralizedVariants) {
        availableVariants = rootKeys
          .filter(translationKey => translationKey.startsWith(`${key}_`))
          .map(translationKey => translationKey.substring(key.length + 1));
      }
    }

    // Une clé n'est considérée comme pluralisée que si :
    // 1. Elle a des variantes pluralisées ET
    // 2. Elle n'existe PAS comme valeur simple
    const isActuallyPluralized = hasPluralizedVariants && !keyExistsAsSimpleValue;

    // Cas prioritaire : clé qui a des variantes pluralisées mais utilisée sans count
    if (isActuallyPluralized && !countNode) {
      context.report({
        node,
        severity: 2,
        message: `'${key}' is a pluralized key and requires a count parameter in '${name}' language`,
      });

      return;
    }

    // Si on utilise count, on s'attend à des variantes pluralisées
    if (countNode) {
      if (isActuallyPluralized) {
        // Vérifier les variantes react-i18next
        const requiredVariants = ['one', 'other'];
        const missingVariants = requiredVariants.filter(variant => !availableVariants.includes(variant));

        if (missingVariants.length) {
          const missingKeys = missingVariants.map(variant => `${key}_${variant}`);
          context.report({
            node,
            message: `[${missingKeys.join(',')}] keys are missing for pluralized key '${key}' in '${name}' language`,
          });
        }
      } else if (has(translation, key)) {
        // NOUVELLE LOGIQUE : Vérifier si count est utilisé dans l'interpolation
        const translateValue = get(translation, key);
        const countUsedInInterpolation = typeof translateValue === 'string' && /\{\{\s*count\s*\}\}/.test(translateValue);

        // Si count n'est pas utilisé pour l'interpolation, alors c'est une erreur
        if (!countUsedInInterpolation) {
          context.report({
            node,
            message: `'${key}' is not a pluralized key and doesn't require a count parameter in '${name}' language`,
          });
        }
        // Sinon, c'est valide : count est utilisé pour l'interpolation
      } else {
        // La clé n'existe pas du tout
        context.report({
          node,
          severity: 2,
          message: `'${key}' is missing from '${name}' language`,
        });
      }

      return;
    }

    // Pour les clés non pluralisées (sans count et sans variantes réelles)
    if (!isActuallyPluralized && !has(translation, key)) {
      context.report({
        node,
        severity: 2,
        message: `'${key}' is missing from '${name}' language`,
      });

      return;
    }

    // Vérifier que la clé simple est bien une string (pas un objet de pluralisation ancien format)
    if (!isActuallyPluralized && has(translation, key) && typeof get(translation, key) !== 'string') {
      context.report({
        node,
        severity: 2,
        message: `'${key}' is not a string in '${name}' language, looks like pluralization value is missing`,
      });

      return;
    }

    // NOUVELLE VALIDATION : Suggérer <Trans> si on passe des données à une traduction qui n'en a pas besoin
    if (!isActuallyPluralized && has(translation, key) && translateParams && translateParams.data && translateParams.data.hasVariables) {
      const translateValue = get(translation, key);

      if (typeof translateValue === 'string') {
        // Vérifier si la traduction utilise des variables d'interpolation
        const hasInterpolation = /\{\{[^}]+\}\}/.test(translateValue);

        // Si on passe des données mais que la traduction n'a pas d'interpolation
        if (!hasInterpolation) {
          context.report({
            node,
            message: `'${key}' doesn't require any interpolation data in '${name}' language. If you want to pass components to renderers, please use <Trans />`,
          });

          return;
        }
      }
    }
  });
};

module.exports = langsKey => ({
  meta: {
    docs: {
      description: 'ensures that used translate key is in translation file',
      category: 'Possible errors',
    },
    schema: [],
  },
  create(context) {
    const config = context.settings.i18n;

    if (isFileIgnored(context.getFilename(), config)) {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        const nodeName = _get(node, 'name.name', null);
        const nodeAttributes = _get(node, 'attributes', null);
        if (nodeName === 'Trans') {
          const filteredAttributes = Object.values(nodeAttributes).reduce(
            (acc, attribute) =>
              Object.assign(acc, { [attribute.name.name]: attribute.value.value || attribute.value.expression.value }),
            {},
          );

          const { i18nKey, number, count } = filteredAttributes;

          if (!i18nKey) {
            return;
          }

          // Support react-i18next: count prend la priorité sur number
          const countNode = count || number;

          check({ key: i18nKey, countNode, config, langsKey, context, node });
        }
      },
      CallExpression(node) {
        const funcName = (node.callee.type === 'MemberExpression' && node.callee.property.name) || node.callee.name;

        if (funcName !== config.functionName || !node.arguments || !node.arguments.length) {
          return;
        }

        const [keyNode] = node.arguments;
        const [, optionsNode] = node.arguments;

        const translateParams = getTranslateParams(optionsNode);
        const countNode = translateParams.count || translateParams.number;

        const key = getKeyValue(keyNode);

        if (!key) {
          return;
        }

        check({ key, countNode, config, langsKey, context, node, translateParams });
      },
    };
  },
});
