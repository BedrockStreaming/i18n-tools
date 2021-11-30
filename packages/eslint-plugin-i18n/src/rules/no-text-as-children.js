const { isFileIgnored } = require('../utils/utils');

module.exports = {
  meta: {
    docs: {
      description: 'ensures that no plain text is used in JSX components',
      category: 'Possible errors',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignorePattern: {
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

    const [options] = context.options;
    const { ignorePattern } = options || {};

    return {
      JSXElement(node) {
        node.children.forEach(child => {
          if (child.type === 'Literal') {
            const text = child.value.trim().replace('\\n', '');
            if (text.length && (!ignorePattern || !new RegExp(ignorePattern).test(text))) {
              context.report({
                node: child,
                message: `Untranslated text '${text}'`,
              });
            }
          }
        });
      },
    };
  },
};
