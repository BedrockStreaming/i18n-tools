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
    // Tests basiques
    { code: 't("basic")', settings },
    { code: 't("interpolated", data)', settings },

    // Tests avec pluralisation
    { code: 't("pluralized", { count: 1 })', settings },
    { code: 't("pluralizedAndInterpolated", { count: 2 })', settings },
    { code: 't("advancedPlural", { count: 5 })', settings },

    // Tests avec clés imbriquées
    { code: 't("complexKey.nested", { count: 3 })', settings },
    { code: 't("nested.simpleKey")', settings },
    { code: 't("module.pluralKey", { count: 2 })', settings },
    { code: 't("items.count", { count: 5 })', settings },

    // Tests avec interpolation
    { code: 't("pricing.details", { amount: 10 })', settings },
    { code: 't("user.score", { count: 42 })', settings },
    { code: 't("validation.minLength", { min: 8 })', settings },

    // Tests pour attributs et clés simples imbriquées
    { code: 't("foo.bar")', settings },
    { code: 't("form.email.placeholder")', settings },
    { code: 't("form.email.label")', settings },
    { code: 't("button.submit")', settings },
    { code: 't("button.cancel")', settings },

    // Tests JSX
    { code: '<Trans i18nKey="basic" />', settings, parserOptions },
    { code: '<Trans i18nKey="pluralized" count={1} />', settings, parserOptions },
    { code: '<Trans i18nKey="pluralizedAndInterpolated" count={2} />', settings, parserOptions },
    { code: '<Trans i18nKey="complexKey.nested" count={3} />', settings, parserOptions },
    { code: '<Trans i18nKey="advancedPlural" count={5} />', settings, parserOptions },
    { code: '<Trans i18nKey="nested.simpleKey" />', settings, parserOptions },
    { code: '<Trans i18nKey="module.pluralKey" count={2} />', settings, parserOptions },
    { code: '<Trans i18nKey="items.count" count={5} />', settings, parserOptions },
    { code: '<Trans i18nKey="foo.bar" />', settings, parserOptions },
    { code: '<Trans i18nKey="button.submit" />', settings, parserOptions },
  ],
  invalid: [
    // Test fichier de langue manquant
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

    // Test clé manquante
    {
      code: 't("nonExistentKey")',
      settings,
      errors: [
        {
          message: "'nonExistentKey' is missing from 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="nonExistentKey" />',
      settings,
      errors: [
        {
          message: "'nonExistentKey' is missing from 'en' language",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },

    // Test utilisation incorrecte de count avec clé non pluralisée
    {
      code: 't("basic", { count: 42 })',
      settings,
      errors: [
        {
          message: "'basic' is not a pluralized key and doesn't require a count parameter in 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="basic" count={42} />',
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
      code: 't("interpolated", { count: 1 })',
      settings,
      errors: [
        {
          message: "'interpolated' is not a pluralized key and doesn't require a count parameter in 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="interpolated" count={1} />',
      settings,
      errors: [
        {
          message: "'interpolated' is not a pluralized key and doesn't require a count parameter in 'en' language",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },

    // Test clé pluralisée utilisée sans count
    {
      code: 't("pluralized")',
      settings,
      errors: [
        {
          message: "'pluralized' is a pluralized key and requires a count parameter in 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="pluralized" />',
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
      code: 't("advancedPlural")',
      settings,
      errors: [
        {
          message: "'advancedPlural' is a pluralized key and requires a count parameter in 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="advancedPlural" />',
      settings,
      errors: [
        {
          message: "'advancedPlural' is a pluralized key and requires a count parameter in 'en' language",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },

    // Test clé pluralisée avec variantes manquantes
    {
      code: 't("incompleteKey", { count: 1 })',
      settings,
      errors: [
        {
          message: "[incompleteKey_other] keys are missing for pluralized key 'incompleteKey' in 'en' language",
          type: 'CallExpression',
        },
      ],
    },

    // Test clé imbriquée inexistante
    {
      code: 't("complexKey.nonExistent", { count: 1 })',
      settings,
      errors: [
        {
          message: "'complexKey.nonExistent' is missing from 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="complexKey.nonExistent" count={1} />',
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
      code: 't("nested.nonExistent")',
      settings,
      errors: [
        {
          message: "'nested.nonExistent' is missing from 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 't("form.nonExistent.placeholder")',
      settings,
      errors: [
        {
          message: "'form.nonExistent.placeholder' is missing from 'en' language",
          type: 'CallExpression',
        },
      ],
    },

    // Test clés pluralisées imbriquées sans count
    {
      code: 't("module.pluralKey")',
      settings,
      errors: [
        {
          message: "'module.pluralKey' is a pluralized key and requires a count parameter in 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 't("items.count")',
      settings,
      errors: [
        {
          message: "'items.count' is a pluralized key and requires a count parameter in 'en' language",
          type: 'CallExpression',
        },
      ],
    },
  ],
});
