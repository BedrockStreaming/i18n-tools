// eslint-disable-next-line no-underscore-dangle
const _get = require('lodash/get');
const { getKeyValue, get, has, getLangConfig, getTranslateParams, isFileIgnored } = require('../utils/utils');

const check = ({ key, countNode, config, langsKey, context, node }) => {
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
    const hasPluralizedVariants = Object.keys(translation).some(translationKey =>
      translationKey.startsWith(`${key}_`)
    );

    // Cas prioritaire : clé qui a des variantes pluralisées mais utilisée sans count
    if (hasPluralizedVariants && !countNode) {
      context.report({
        node,
        severity: 2,
        message: `'${key}' is a pluralized key and requires a count parameter in '${name}' language`,
      });
      return;
    }

    // Si on utilise count, on s'attend à des variantes pluralisées
    if (countNode) {
      if (hasPluralizedVariants) {
        // Vérifier les variantes react-i18next
        const availableVariants = Object.keys(translation)
          .filter(translationKey => translationKey.startsWith(`${key}_`))
          .map(translationKey => translationKey.substring(key.length + 1));

        // Au minimum, il faut _one et _other pour react-i18next
        const requiredVariants = ['one', 'other'];
        const missingVariants = requiredVariants.filter(variant => !availableVariants.includes(variant));

        if (missingVariants.length) {
          const missingKeys = missingVariants.map(variant => `${key}_${variant}`);
          context.report({
            node,
            message: `[${missingKeys.join(',')}] keys are missing for pluralized key '${key}' in '${name}' language`,
          });
        }
      } else {
        // Cas où on utilise count mais la clé n'a pas de variantes pluralisées
        if (has(translation, key)) {
          // La clé existe comme string simple, mais on essaie de l'utiliser avec count
          context.report({
            node,
            message: `'${key}' is not a pluralized key and doesn't require a count parameter in '${name}' language`,
          });
        } else {
          // La clé n'existe pas du tout
          context.report({
            node,
            severity: 2,
            message: `'${key}' is missing from '${name}' language`,
          });
        }
      }
      return;
    }

    // Pour les clés non pluralisées (sans count et sans variantes)
    if (!hasPluralizedVariants && !has(translation, key)) {
      context.report({
        node,
        severity: 2,
        message: `'${key}' is missing from '${name}' language`,
      });
      return;
    }

    // Vérifier que la clé simple est bien une string (pas un objet de pluralisation ancien format)
    if (!hasPluralizedVariants && has(translation, key) && typeof get(translation, key) !== 'string') {
      context.report({
        node,
        severity: 2,
        message: `'${key}' is not a string in '${name}' language, looks like pluralization value is missing`,
      });
      return;
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

        const { number: countNode } = getTranslateParams(optionsNode);

        const key = getKeyValue(keyNode);

        if (!key) {
          return;
        }

        check({ key, countNode, config, langsKey, context, node });
      },
    };
  },
});
