const RuleTester = require('eslint/lib/testers/rule-tester');
const rule = require('../../../src/rules/no-unknown-key')('principalLangs');

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

ruleTester.run('m6web-i18n/no-unknown-key', rule, {
  valid: [
    { code: 't("basic")', settings },
    { code: 't("interpolated", data)', settings },
    { code: 't("pluralized", { count: 1 })', settings }, // Test avec count pour clé pluralisée react-i18next
    { code: 't("pluralizedAndInterpolated", { count: 2 })', settings }, // Test avec clé pluralisée + interpolation
    { code: 't("complexKey.nested", { count: 3 })', settings }, // Test avec clé imbriquée
    { code: 't("advancedPlural", { count: 5 })', settings }, // Test avec variantes non-standard (_zero, _few, _many)
    {
      code: '<Trans i18nKey="basic" />',
      settings,
      parserOptions,
    },
    {
      code: '<Trans i18nKey="pluralized" count={1} />',
      settings,
      parserOptions,
    },
    {
      code: '<Trans i18nKey="pluralizedAndInterpolated" count={2} />',
      settings,
      parserOptions,
    },
    {
      code: '<Trans i18nKey="complexKey.nested" count={3} />', // Test avec clé imbriquée JSX
      settings,
      parserOptions,
    },
    {
      code: '<Trans i18nKey="advancedPlural" count={5} />', // Test avec variantes non-standard JSX
      settings,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: 't("foo")',
      settings: {
        i18n: {
          disableCache: true,
          functionName: 't',
          principalLangs: [
            {
              name: 'es',
              translationPath: 'tests/i18n/es.json',
            },
          ],
        },
      },
      errors: [
        {
          message: "'es' language is missing",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="foo" />',
      settings: {
        i18n: {
          disableCache: true,
          functionName: 't',
          principalLangs: [
            {
              name: 'es',
              translationPath: 'tests/i18n/es.json',
            },
          ],
        },
      },
      errors: [
        {
          message: "'es' language is missing",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: 't("foo")',
      settings,
      errors: [
        {
          message: "'foo' is missing from 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="foo" />',
      settings,
      errors: [
        {
          message: "'foo' is missing from 'en' language",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: 't("basic", { count: 42 })', // Utilisation de count avec une clé non pluralisée
      settings,
      errors: [
        {
          message: "'basic' is not a pluralized key and doesn't require a count parameter in 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="basic" count={42} />', // Utilisation de count avec une clé non pluralisée
      settings,
      errors: [
        {
          message: "'basic' is not a pluralized key and doesn't require a count parameter in 'en' language",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: 't("nonExistentPluralized", { count: 1 })', // Test pour clé pluralisée qui n'existe pas
      settings,
      errors: [
        {
          message: "'nonExistentPluralized' is missing from 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="nonExistentPluralized" count={1} />', // Test pour clé pluralisée qui n'existe pas
      settings,
      errors: [
        {
          message: "'nonExistentPluralized' is missing from 'en' language",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: 't("incompleteKey", { count: 1 })', // Test pour clé qui n'a qu'une seule variante plurielle
      settings,
      errors: [
        {
          message: "[incompleteKey_other] keys are missing for pluralized key 'incompleteKey' in 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 't("interpolated", { count: 1 })', // Test pour clé d'interpolation utilisée avec count
      settings,
      errors: [
        {
          message: "'interpolated' is not a pluralized key and doesn't require a count parameter in 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="interpolated" count={1} />', // Test pour clé d'interpolation utilisée avec count en JSX
      settings,
      errors: [
        {
          message: "'interpolated' is not a pluralized key and doesn't require a count parameter in 'en' language",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: 't("complexKey.nonExistent", { count: 1 })', // Test clé imbriquée qui n'existe pas
      settings,
      errors: [
        {
          message: "'complexKey.nonExistent' is missing from 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="complexKey.nonExistent" count={1} />', // Test clé imbriquée qui n'existe pas JSX
      settings,
      errors: [
        {
          message: "'complexKey.nonExistent' is missing from 'en' language",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: 't("pluralized")', // Test clé pluralisée utilisée sans count
      settings,
      errors: [
        {
          message: "'pluralized' is a pluralized key and requires a count parameter in 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="pluralized" />', // Test clé pluralisée utilisée sans count JSX
      settings,
      errors: [
        {
          message: "'pluralized' is a pluralized key and requires a count parameter in 'en' language",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: 't("advancedPlural")', // Test clé avec variantes non-standard utilisée sans count
      settings,
      errors: [
        {
          message: "'advancedPlural' is a pluralized key and requires a count parameter in 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="advancedPlural" />', // Test clé avec variantes non-standard utilisée sans count JSX
      settings,
      errors: [
        {
          message: "'advancedPlural' is a pluralized key and requires a count parameter in 'en' language",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
  ],
});
