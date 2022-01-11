const RuleTester = require('eslint/lib/testers/rule-tester');
const rule = require('../../../src/rules/no-unknown-key')('principalLangs');

const ruleTester = new RuleTester();

const settings = {
  i18n: {
    disableCache: true,
    functionName: 't',
    pluralizedKeys: ['one', 'other'],
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
    {
      code: '<Trans i18nKey="basic" />',
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
      code: 't("basic", { number: 42 })',
      settings,
      errors: [
        {
          message: "[one,other] keys are missing for key 'basic' in 'en' language",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="basic" number={42} />',
      settings,
      errors: [
        {
          message: "[one,other] keys are missing for key 'basic' in 'en' language",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
    {
      code: 't("pluralized")',
      settings,
      errors: [
        {
          message: "'pluralized' is not a string in 'en' language, looks like pluralization value is missing",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '<Trans i18nKey="pluralized" />',
      settings,
      errors: [
        {
          message: "'pluralized' is not a string in 'en' language, looks like pluralization value is missing",
          type: 'JSXOpeningElement',
        },
      ],
      parserOptions,
    },
  ],
});
