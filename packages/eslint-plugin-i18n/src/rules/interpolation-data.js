const _ = require('lodash');
const { getKeyValue, get, getLangConfig, getTranslateParams, isFileIgnored } = require('../utils/utils');

const check = ({ key, countNode, dataNode, config, context, node }) => {
  getLangConfig(config, 'principalLangs').forEach(({ translation }) => {
    if (!translation) {
      return;
    }

    const isPluralized = !!countNode && Array.isArray(config.pluralizedKeys);
    const translateValue = get(translation, key);
    const [{ interpolationPattern }] = context.options;
    const interpolationTester = new RegExp(interpolationPattern);

    let values;
    if (isPluralized) {
      values = Object.values(translateValue);
    } else {
      values = translateValue ? [translateValue] : [];
    }

    if ((!dataNode || dataNode.name === 'undefined') && values.some(value => interpolationTester.test(value))) {
      context.report({
        node,
        severity: 2,
        message: `'${key}' requires interpolation data.`,
      });

      return;
    }

    if (dataNode && dataNode.name !== 'undefined' && !values.some(value => interpolationTester.test(value))) {
      context.report({
        node,
        severity: 2,
        message: `'${key}' doesn't require any interpolation data.`,
      });
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
        const nodeName = _.get(node, 'name.name', null);
        const nodeAttributes = _.get(node, 'attributes', null);

        if (nodeName === 'Trans') {
          const filteredAttributes = Object.values(nodeAttributes).reduce(
            (acc, attribute) => Object.assign(acc, { [attribute.name.name]: attribute.value.value || attribute.value }),
            {},
          );

          const { i18nKey, number, data } = filteredAttributes;

          if (!i18nKey) {
            return;
          }

          check({ key: i18nKey, countNode: number, dataNode: data, config, context, node });
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
