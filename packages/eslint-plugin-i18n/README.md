# @m6web/eslint-plugin-i18n

[![Continous Integration](https://github.com/M6Web/i18n-tools/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/M6Web/i18n-tools/actions/workflows/continuous-integration.yml)
![npm](https://img.shields.io/npm/v/@m6web/eslint-plugin-i18n)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@m6web/eslint-plugin-i18n)
![npm](https://img.shields.io/npm/dy/@m6web/eslint-plugin-i18n)
![GitHub last commit](https://img.shields.io/github/last-commit/M6Web/i18n-tools)
![NPM](https://img.shields.io/npm/l/@m6web/eslint-plugin-i18n)

This is an [eslint](http://eslint.org/) plugin for i18n in a [react](https://facebook.github.io/react/) application.
This plugin provides you with a set of rules to check the correct use of the translation keys but also forces you not to introduce untranslated texts in your React components.

## Installation

``` shell
yarn add -D @m6web/eslint-plugin-i18n
```

## Build

``` shell
yarn build
```

## Rules

 * **@m6web/i18n/no-unknown-key**: Verify that all translation keys you use are present in your primary translation files.
 * **@m6web/i18n/no-unknown-key-secondary-langs**: Same as the previous one. Allow you to have a different error level for secondary languages.
 * **@m6web/i18n/no-text-as-children**: Verify that you have no text children in your react code.
 * **@m6web/i18n/no-text-as-attribute**: Verify that you have no text in some attributes in your react components. List of attributes as to be provided in the config.
 * **@m6web/i18n/interpolation-data**: Checks for usage of keys containing string interpolation, if translate function is called without
 interpolation data it will show an error. Also if interpolation data is given and key doesn't contain interpolation it will also
 show an error. `interpolationPattern` option is required to match interpolation in your translation file.
 
## Config

You have to add the following lines in your `.eslintrc` file to configure this plugin:

```js
  // Declare the plugin
  "plugins": [
    "@m6web/i18n"
  ],
  // Specify rules severity
  "rules": {
    "@m6web/i18n/no-unknown-key": "error",
    "@m6web/i18n/no-unknown-key-secondary-langs": "warn",
    "@m6web/i18n/no-text-as-children": ["error", {"ignorePattern": "^\\s?[/.]\\s?$"}],
    "@m6web/i18n/no-text-as-attribute": ["error", {"attributes": ["alt", "title"]}],
    "@m6web/i18n/interpolation-data": ["error", { "interpolationPattern": "\\{\\.+\\}" }]
  },
  // The plugin needs jsx feature to be on for 'no-text-as-children' rule
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  // Settings of your translation
  "settings": {
    "i18n": {
      // Your principal languages used in 'no-unknown-key' rule
      "principalLangs": [
        {
          "name": "fr",
          "translationPath": "i18n/fr.json"
        }
      ],
      // Secondary languages used in 'no-unknown-key-secondary-langs' rule
      "secondaryLangs": [
        {
          "name": "en",
          "translationPath": "i18n/en.json"
        }
      ],
      // Name of your translate function
      "functionName": "t",
      // If you want to ignore specific files
      "ignoreFiles": "**/*.spec.js",
      // If you have pluralization
      "pluralizedKeys": ["one", "other"],
      // TTL of the translations file caching (defaults to 500ms)
      "translationsCacheTTL": 300
    }
  }
```
