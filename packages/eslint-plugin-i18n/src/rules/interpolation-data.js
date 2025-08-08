// eslint-disable-next-line no-underscore-dangle
const _get = require('lodash/get');
const { getKeyValue, get, getLangConfig, getTranslateParams, isFileIgnored } = require('../utils/utils');

const check = ({ key, countNode, dataNode, config, context, node }) => {
  getLangConfig(config, 'principalLangs').forEach(({ translation }) => {
    if (!translation) {
      return;
    }

    const [{ interpolationPattern }] = context.options;
    const interpolationTester = new RegExp(interpolationPattern);

    // Détecter si la clé a des variantes pluralisées (format hybride réaliste)
    // Structure imbriquée + pluralisation xxx_yyy où yyy n'est pas prédéfini
    const keyParts = key.split('.');
    const parentPath = keyParts.slice(0, -1).join('.');
    const baseKey = keyParts[keyParts.length - 1];

    let hasPluralizedVariants = false;
    let keyExistsAsSimpleValue = false;

    if (parentPath) {
      // Clé imbriquée : chercher dans l'objet parent
      const parentObject = get(translation, parentPath);
      if (parentObject && typeof parentObject === 'object') {
        const parentKeys = Object.keys(parentObject);

        // Vérifier si la clé existe comme valeur simple dans le contexte parent
        keyExistsAsSimpleValue = parentKeys.includes(baseKey) && typeof parentObject[baseKey] === 'string';

        // Vérifier si on a des variantes pluralisées pour cette clé spécifique dans le même contexte
        // Format xxx_yyy où yyy n'est pas prédéfini
        hasPluralizedVariants = parentKeys.some(
          translationKey => translationKey.startsWith(`${baseKey}_`) && translationKey !== baseKey
        );
      }
    } else {
      // Clé de niveau racine : chercher seulement les variantes de cette clé exacte
      const rootKeys = Object.keys(translation);

      // Vérifier si la clé existe comme valeur simple au niveau racine
      keyExistsAsSimpleValue = get(translation, key) && typeof get(translation, key) === 'string';

      hasPluralizedVariants = rootKeys.some(translationKey => translationKey.startsWith(`${key}_`) && translationKey !== key);
    }

    // Une clé n'est considérée comme pluralisée que si :
    // 1. Elle a des variantes pluralisées ET
    // 2. Elle n'existe PAS comme valeur simple
    const isActuallyPluralized = hasPluralizedVariants && !keyExistsAsSimpleValue;

    const isPluralized = !!countNode;
    let values = [];

    if (isPluralized && isActuallyPluralized) {
      // Support react-i18next pluralization format - auto-detect any _xxx suffixes
      const pluralizedValues = [];

      if (parentPath) {
        // Pour les clés imbriquées, chercher dans l'objet parent
        const parentObject = get(translation, parentPath);
        if (parentObject && typeof parentObject === 'object') {
          Object.keys(parentObject).forEach(translationKey => {
            if (translationKey.startsWith(`${baseKey}_`)) {
              pluralizedValues.push(parentObject[translationKey]);
            }
          });
        }
      } else {
        // Pour les clés racine, chercher au niveau racine
        Object.keys(translation).forEach(translationKey => {
          if (translationKey.startsWith(`${key}_`)) {
            pluralizedValues.push(translation[translationKey]);
          }
        });
      }

      if (pluralizedValues.length > 0) {
        // Use the pluralized variants found
        values = pluralizedValues;
      } else {
        // Fallback to old format (nested object) - check if pluralizedKeys is configured
        const translateValue = get(translation, key);
        if (translateValue && typeof translateValue === 'object' && Array.isArray(config.pluralizedKeys)) {
          values = config.pluralizedKeys
            .map(suffix => translateValue[suffix.replace('_', '')])
            .filter(value => value !== undefined);
        }
      }
    } else {
      const translateValue = get(translation, key);
      values = translateValue ? [translateValue] : [];
    }

    const hasInterpolation = values.some(value => interpolationTester.test(value));
    const hasDataProvided = dataNode && (dataNode.name !== 'undefined' || dataNode.hasVariables);

    // NOUVELLE LOGIQUE : Vérifier si count est utilisé dans l'interpolation
    // Ceci fonctionne pour TOUTES les clés (pluralisées ou non)
    const countUsedInInterpolation = values.some(value =>
      value && typeof value === 'string' && interpolationTester.test(value) &&
      (value.includes('{{ count }}') || value.includes('{{count}}'))
    );

    // Considérer que les données sont fournies si on a dataNode OU si count satisfait l'interpolation
    const hasDataProvidedIncludingCount = hasDataProvided || (countNode && countUsedInInterpolation);

    // Cas 1: Des données inutiles sont fournies (incluant count sur clé non-pluralisée)
    if (hasDataProvided && !hasInterpolation) {
      context.report({
        node,
        severity: 2,
        message: `'${key}' doesn't require any interpolation data. If you want to pass components to renderers, please use <Trans />`,
      });
      return;
    }

    // Cas 1b: Count fourni sur clé non-pluralisée qui n'utilise pas count dans l'interpolation
    if (countNode && !isActuallyPluralized && !countUsedInInterpolation) {
      context.report({
        node,
        severity: 2,
        message: `'${key}' doesn't require any interpolation data. If you want to pass components to renderers, please use <Trans />`,
      });
      return;
    }

    // Cas 2: Clé pluralisée sans count (seulement si pas de données inutiles)
    if (isActuallyPluralized && !countNode) {
      context.report({
        node,
        severity: 2,
        message: `'${key}' is a pluralized key and requires a count parameter.`,
      });
      return;
    }

    // Cas 3: Données d'interpolation manquantes
    if (!hasDataProvidedIncludingCount && hasInterpolation) {
      context.report({
        node,
        severity: 2,
        message: `'${key}' requires interpolation data.`,
      });
      return;
    }
  });
};

module.exports = {
  meta: {
    docs: {
      description: 'ensures that interpolated translate key have data',
      category: 'Possible errors',
    },
    schema: [
      {
        type: 'object',
        required: ['interpolationPattern'],
        properties: {
          interpolationPattern: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
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
            (acc, attribute) => Object.assign(acc, { [attribute.name.name]: attribute.value.value || attribute.value }),
            {},
          );

          const { i18nKey, number, count, values } = filteredAttributes;

          if (!i18nKey || typeof i18nKey !== 'string') {
            return;
          }

          // Support react-i18next: count prend la priorité sur number
          const countNode = count || number;

          // Support react-i18next: les variables sont dans la prop values, pas en attributs directs
          const dataNode = values;

          check({ key: i18nKey, countNode, dataNode, config, context, node });
        }
      },
      CallExpression(node) {
        const funcName = (node.callee.type === 'MemberExpression' && node.callee.property.name) || node.callee.name;

        if (funcName !== config.functionName || !node.arguments || !node.arguments.length) {
          return;
        }

        const [keyNode] = node.arguments;
        const [, optionsNode] = node.arguments;

        const { data: dataNode, number: countNode } = getTranslateParams(optionsNode);

        const key = getKeyValue(keyNode);

        if (!key) {
          return;
        }

        check({ key, countNode, dataNode, config, context, node });
      },
    };
  },
};
