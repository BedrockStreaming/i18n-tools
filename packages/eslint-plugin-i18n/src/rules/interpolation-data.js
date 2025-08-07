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

    // Détecter si la clé a des variantes pluralisées
    const hasPluralizedVariants = Object.keys(translation).some(translationKey =>
      translationKey.startsWith(`${key}_`)
    );

    const isPluralized = !!countNode;
    let values = [];

    if (isPluralized) {
      // Support react-i18next pluralization format - auto-detect any _xxx suffixes
      const pluralizedValues = [];

      // Check for any keys that start with the base key followed by underscore
      Object.keys(translation).forEach(translationKey => {
        if (translationKey.startsWith(`${key}_`)) {
          pluralizedValues.push(translation[translationKey]);
        }
      });

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
    const hasDataProvided = dataNode && dataNode.name !== 'undefined';

    // Cas 1: Des données inutiles sont fournies
    if (hasDataProvided && !hasInterpolation) {
      context.report({
        node,
        severity: 2,
        message: `'${key}' doesn't require any interpolation data.`,
      });
      return;
    }

    // Cas 2: Clé pluralisée sans count (seulement si pas de données inutiles)
    if (hasPluralizedVariants && !countNode) {
      context.report({
        node,
        severity: 2,
        message: `'${key}' is a pluralized key and requires a count parameter.`,
      });
      return;
    }

    // Cas 3: Données d'interpolation manquantes
    if (!hasDataProvided && hasInterpolation) {
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
