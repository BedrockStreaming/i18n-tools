const _ = require('lodash');
const minimatch = require('minimatch');
const { getKeyValue, get, has, getLangConfig, areWeUsingUseTranslate } = require('../utils/utils');

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

    if (typeof countNode === 'undefined' && !has(translation, key)) {
      context.report({
        node,
        severity: 2,
        message: `'${key}' is missing from '${name}' language`,
      });

      return;
    }

    if (typeof countNode === 'undefined' && has(translation, key) && typeof get(translation, key) !== 'string') {
      context.report({
        node,
        severity: 2,
        message: `'${key}' is not a string in '${name}' language, looks like pluralization value is missing`,
      });

      return;
    }

    if (countNode && Array.isArray(config.pluralizedKeys)) {
      const missingKeys = config.pluralizedKeys.filter(plural => !has(translation, `${key}.${plural}`));

      if (missingKeys.length) {
        context.report({
          node,
          message: `[${missingKeys}] keys are missing for key '${key}' in '${name}' language`,
        });
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

    if (!config || (config.ignoreFiles && minimatch(context.getFilename(), config.ignoreFiles))) {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        const nodeName = _.get(node, 'name.name', null);
        const nodeAttributes = _.get(node, 'attributes', null);
        if (nodeName === 'Trans') {
          const filteredAttributes = Object.values(nodeAttributes).reduce(
            (acc, attribute) =>
              Object.assign(acc, { [attribute.name.name]: attribute.value.value || attribute.value.expression.value }),
            {},
          );

          const { i18nKey, number } = filteredAttributes;

          if (!i18nKey) {
            return;
          }
          check({ key: i18nKey, countNode: number, config, langsKey, context, node });
        }
      },
      CallExpression(node) {
        const funcName = (node.callee.type === 'MemberExpression' && node.callee.property.name) || node.callee.name;

        if (funcName !== config.functionName || !node.arguments || !node.arguments.length) {
          return;
        }

        const [keyNode] = node.arguments;
        let [, dataNode, countNode] = node.arguments;

        const [usingHook, params] = areWeUsingUseTranslate(dataNode);

        if (usingHook) {
          dataNode = params.data;
          countNode = params.count;
        }

        const key = getKeyValue(keyNode);

        if (!key) {
          return;
        }

        check({ key, countNode, config, langsKey, context, node });
      },
    };
  },
});
