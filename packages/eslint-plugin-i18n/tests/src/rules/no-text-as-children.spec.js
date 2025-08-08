const RuleTester = require('eslint/lib/testers/rule-tester');
const rule = require('../../../src/rules/no-text-as-children');

const ruleTester = new RuleTester();

const parserOptions = {
  ecmaFeatures: {
    jsx: true,
  },
};

const settings = {
  disableCache: true,
};

const options = [
  {
    ignorePattern: '^\\s?[/.]\\s?$',
  },
];

ruleTester.run('m6web-i18n/no-text-as-children', rule, {
  valid: [
    { code: '<span>{t("basic")}</span>', parserOptions, settings },
    { code: '<div>{t("button.submit")}</div>', parserOptions, settings },
    { code: '<p>{t("button.cancel")}</p>', parserOptions, settings },
    { code: '<h1>{t("error.notFound")}</h1>', parserOptions, settings },
    { code: '<button>{t("button.save")}</button>', parserOptions, settings },
  ],
  invalid: [
    {
      code: '<span>Hello world !</span>',
      parserOptions,
      settings,
      errors: [
        {
          message: "Untranslated text 'Hello world !'",
          type: 'Literal',
        },
      ],
    },
    {
      code: '<span>{t("basic")}a.</span>',
      parserOptions,
      settings,
      options,
      errors: [
        {
          message: "Untranslated text 'a.'",
          type: 'Literal',
        },
      ],
    },
  ],
});
