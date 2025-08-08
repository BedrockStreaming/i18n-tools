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
    // Tests basiques sans interpolation
    { code: 't("basic")', settings, options },
    { code: 't("button.submit")', settings, options },
    { code: 't("button.cancel")', settings, options },

    // Tests avec interpolation simple
    { code: 't("interpolated", { name: "John" })', settings, options },
    { code: 't("pricing.details", { amount: 10 })', settings, options },
    { code: 't("validation.minLength", { min: 8 })', settings, options },

    // Tests avec pluralisation simple (sans interpolation additionnelle)
    { code: 't("pluralized", { count: 1 })', settings, options },
    { code: 't("advancedPlural", { count: 5 })', settings, options },

    // Tests avec pluralisation et interpolation
    { code: 't("pluralizedAndInterpolated", { count: 2, number: 2 })', settings, options },
    { code: 't("module.pluralKey", { count: 3, days: 5 })', settings, options },
    { code: 't("items.count", { count: 5 })', settings, options }, // count utilisé pour pluralisation ET interpolation

    // Tests avec clés imbriquées
    { code: 't("nested.simpleKey")', settings, options },
    { code: 't("complexKey.nested", { count: 3 })', settings, options },
    { code: 't("form.email.placeholder")', settings, options },
    { code: 't("form.email.label")', settings, options },

    // Tests où count est juste une variable d'interpolation normale (pas de pluralisation)
    { code: 't("user.score", { count: 42 })', settings, options },
    { code: 't("validation.minLength", { min: 8 })', settings, options },

    // Tests avec objet contenant les variables d'interpolation
    { code: 't("pricing.details", priceData)', settings, options },
    { code: 't("interpolated", userData)', settings, options },

    // Tests JSX basiques
    { code: '<Trans i18nKey="basic" />', settings, options, parserOptions },
    { code: '<Trans i18nKey="button.cancel" />', settings, options, parserOptions },
    { code: '<Trans i18nKey="button.submit" />', settings, options, parserOptions },

    // Tests JSX avec interpolation
    { code: '<Trans i18nKey="interpolated" values={{ name: "John" }} />', settings, options, parserOptions },
    { code: '<Trans i18nKey="pricing.details" values={{ amount: 10 }} />', settings, options, parserOptions },
    { code: '<Trans i18nKey="validation.minLength" values={{ min: 8 }} />', settings, options, parserOptions },

    // Tests JSX avec pluralisation
    { code: '<Trans i18nKey="pluralized" count={1} />', settings, options, parserOptions },
    { code: '<Trans i18nKey="advancedPlural" count={5} />', settings, options, parserOptions },

    // Tests JSX avec pluralisation et interpolation
    {
      code: '<Trans i18nKey="pluralizedAndInterpolated" count={2} values={{ number: 2 }} />',
      settings,
      options,
      parserOptions,
    },
    {
      code: '<Trans i18nKey="module.pluralKey" count={3} values={{ days: 5 }} />',
      settings,
      options,
      parserOptions,
    },
    {
      code: '<Trans i18nKey="items.count" count={5} />',
      settings,
      options,
      parserOptions,
    },

    // Tests JSX avec clés imbriquées
    {
      code: '<Trans i18nKey="nested.simpleKey" />',
      settings,
      options,
      parserOptions,
    },
    {
      code: '<Trans i18nKey="complexKey.nested" count={3} />',
      settings,
      options,
      parserOptions,
    },
    {
      code: '<Trans i18nKey="form.email.placeholder" />',
      settings,
      options,
      parserOptions,
    },

    // Tests JSX où count est juste une variable d'interpolation normale
    {
      code: '<Trans i18nKey="user.score" values={{ count: 42 }} />',
      settings,
      options,
      parserOptions,
    },
    {
      code: '<Trans i18nKey="validation.minLength" values={{ min: 8 }} />',
      settings,
      options,
      parserOptions,
    },

    // Tests JSX avec objet contenant les variables d'interpolation
    {
      code: '<Trans i18nKey="pricing.details" values={priceData} />',
      settings,
      options,
      parserOptions,
    },
  ],
  invalid: [
    // Tests clés simples avec variables non nécessaires
    {
      code: 't("basic", { name: "John" })',
      settings,
      options,
      errors: [
        {
          message: "'basic' doesn't require any interpolation data. If you want to pass components to renderers, please use <Trans />",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 't("button.submit", { foo: "bar" })',
      settings,
      options,
      errors: [
        {
          message: "'button.submit' doesn't require any interpolation data. If you want to pass components to renderers, please use <Trans />",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 't("button.cancel", { count: 1 })',
      settings,
      options,
      errors: [
        {
          message: "'button.cancel' doesn't require any interpolation data. If you want to pass components to renderers, please use <Trans />",
          type: 'CallExpression',
        },
      ],
    },

    // Tests JSX avec variables non nécessaires
    {
      code: '<Trans i18nKey="basic" values={{ name: "John" }} />',
      settings,
      options,
      errors: [
        {
          message: "'basic' doesn't require any interpolation data. If you want to pass components to renderers, please use <Trans />",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: '<Trans i18nKey="button.cancel" values={{ foo: "bar" }} />',
      settings,
      options,
      errors: [
        {
          message: "'button.cancel' doesn't require any interpolation data. If you want to pass components to renderers, please use <Trans />",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: '<Trans i18nKey="form.email.placeholder" values={{ name: "test" }} />',
      settings,
      options,
      errors: [
        {
          message: "'form.email.placeholder' doesn't require any interpolation data. If you want to pass components to renderers, please use <Trans />",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },

    // Tests manque de variables d'interpolation
    {
      code: 't("interpolated")',
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
      code: 't("pricing.details")',
      settings,
      options,
      errors: [
        {
          message: "'pricing.details' requires interpolation data.",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 't("validation.minLength")',
      settings,
      options,
      errors: [
        {
          message: "'validation.minLength' requires interpolation data.",
          type: 'CallExpression',
        },
      ],
    },

    // Tests JSX manque de variables d'interpolation
    {
      code: '<Trans i18nKey="interpolated" />',
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
      code: '<Trans i18nKey="pricing.details" />',
      settings,
      options,
      errors: [
        {
          message: "'pricing.details' requires interpolation data.",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: '<Trans i18nKey="user.score" />',
      settings,
      options,
      errors: [
        {
          message: "'user.score' requires interpolation data.",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },

    // Tests clés pluralisées avec variables non nécessaires
    {
      code: 't("pluralized", { foo: "bar" })',
      settings,
      options,
      errors: [
        {
          message: "'pluralized' doesn't require any interpolation data. If you want to pass components to renderers, please use <Trans />",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 't("advancedPlural", { name: "test", foo: "bar" })',
      settings,
      options,
      errors: [
        {
          message: "'advancedPlural' doesn't require any interpolation data. If you want to pass components to renderers, please use <Trans />",
          type: 'CallExpression',
        },
      ],
    },

    // Tests clés pluralisées sans count
    {
      code: 't("pluralized")',
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
      code: 't("module.pluralKey")',
      settings,
      options,
      errors: [
        {
          message: "'module.pluralKey' is a pluralized key and requires a count parameter.",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 't("items.count")',
      settings,
      options,
      errors: [
        {
          message: "'items.count' is a pluralized key and requires a count parameter.",
          type: 'CallExpression',
        },
      ],
    },

    // Tests JSX clés pluralisées sans count
    {
      code: '<Trans i18nKey="pluralized" />',
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
      code: '<Trans i18nKey="module.pluralKey" />',
      settings,
      options,
      errors: [
        {
          message: "'module.pluralKey' is a pluralized key and requires a count parameter.",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },

    // Tests JSX clés pluralisées avec variables non nécessaires
    {
      code: '<Trans i18nKey="pluralized" values={{ foo: "bar" }} />',
      settings,
      options,
      errors: [
        {
          message: "'pluralized' doesn't require any interpolation data. If you want to pass components to renderers, please use <Trans />",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },

    // Tests clés pluralisées avec interpolation - manque de variables
    {
      code: 't("pluralizedAndInterpolated", { count: 2 })',
      settings,
      options,
      errors: [
        {
          message: "'pluralizedAndInterpolated' requires interpolation data.",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 't("module.pluralKey", { count: 3 })',
      settings,
      options,
      errors: [
        {
          message: "'module.pluralKey' requires interpolation data.",
          type: 'CallExpression',
        },
      ],
    },

    // Tests JSX clés pluralisées avec interpolation - manque de variables
    {
      code: '<Trans i18nKey="pluralizedAndInterpolated" count={2} />',
      settings,
      options,
      errors: [
        {
          message: "'pluralizedAndInterpolated' requires interpolation data.",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: '<Trans i18nKey="module.pluralKey" count={3} />',
      settings,
      options,
      errors: [
        {
          message: "'module.pluralKey' requires interpolation data.",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
  ],
});
