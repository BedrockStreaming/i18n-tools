# @m6web/i18n-lint

[![Continous Integration](https://github.com/M6Web/i18n-tools/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/M6Web/i18n-tools/actions/workflows/continuous-integration.yml)
![npm](https://img.shields.io/npm/v/@m6web/i18n-lint)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@m6web/i18n-lint)
![npm](https://img.shields.io/npm/dy/@m6web/i18n-lint)
![GitHub last commit](https://img.shields.io/github/last-commit/M6Web/i18n-tools)
![NPM](https://img.shields.io/npm/l/@m6web/i18n-lint)

Linter for i18n translation files used at [Bedrock Streaming](https://www.bedrockstreaming.com/)

## Install

```sh
yarn add -D i18n-lint

yarn i18n-lint --config tests/test.config.json
```

## Config

```json
{
  "path": "./tests/i18n"
}
```

## Contributing

### Setup
```sh
yarn
```

### Build
```sh
yarn build
```

### Test
```sh
yarn test

node lib/index.js --config tests/test.config.json
```
