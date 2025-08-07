const RuleTester = require('eslint/lib/testers/rule-tester');
const rule = require('../../../src/rules/interpolation-data');

const ruleTester = new RuleTester();

const settings = {
  i18n: {
    disableCache: true,
    functionName: 't',
    principalLangs: [
      {
        name: 'en',
        translationPath: 'tests/i18n/en.json',
      },
    ],
  },
};

const parserOptions = {
  ecmaFeatures: {
    jsx: true,
  },
};

const options = [
  {
    interpolationPattern: '\\{\\{\\s*.+?\\s*\\}\\}',
  },
];

ruleTester.run('m6web-i18n/interpolation-data', rule, {
  valid: [
    { code: 't("basic")', settings, options },
    { code: 't("interpolated", { name: "John" })', settings, options }, // Variables directes avec t()
    { code: 't("pluralized", { count: 1 })', settings, options }, // count avec t()
    { code: 't("pluralizedAndInterpolated", { count: 2, number: 2 })', settings, options }, // Variables + count avec t()
    { code: '<Trans i18nKey="basic" />', settings, options, parserOptions },
    { code: '<Trans i18nKey="interpolated" values={{ name: "John" }} />', settings, options, parserOptions }, // Variables avec values prop
    { code: '<Trans i18nKey="pluralized" count={1} />', settings, options, parserOptions }, // count en JSX
    {
      code: '<Trans i18nKey="pluralizedAndInterpolated" count={2} values={{ number: 2 }} />',
      settings,
      options,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: 't("basic", { name: "John" })', // Ne devrait pas avoir de variables
      settings,
      options,
      errors: [
        {
          message: "'basic' doesn't require any interpolation data.",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="basic" values={{ name: "John" }} />', // Ne devrait pas avoir de variables en JSX avec values
      settings,
      options,
      errors: [
        {
          message: "'basic' doesn't require any interpolation data.",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: 't("interpolated")', // Manque les variables
      settings,
      options,
      errors: [
        {
          message: "'interpolated' requires interpolation data.",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="interpolated" />', // Manque les variables en JSX
      settings,
      options,
      errors: [
        {
          message: "'interpolated' requires interpolation data.",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: 't("pluralized", { foo: "bar" })', // Variables non nécessaires pour pluralized
      settings,
      options,
      errors: [
        {
          message: "'pluralized' doesn't require any interpolation data.",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 't("pluralized")', // Manque count pour une clé pluralisée
      settings,
      options,
      errors: [
        {
          message: "'pluralized' is a pluralized key and requires a count parameter.",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="pluralized" />', // Manque count pour une clé pluralisée en JSX
      settings,
      options,
      errors: [
        {
          message: "'pluralized' is a pluralized key and requires a count parameter.",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: '<Trans i18nKey="pluralized" values={{ foo: "bar" }} />', // Variables non nécessaires pour pluralized en JSX
      settings,
      options,
      errors: [
        {
          message: "'pluralized' doesn't require any interpolation data.",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: 't("pluralizedAndInterpolated", { count: 2 })', // Manque les variables d'interpolation
      settings,
      options,
      errors: [
        {
          message: "'pluralizedAndInterpolated' requires interpolation data.",
          type: 'CallExpression',
        },
      ],
    },
  ],
});
