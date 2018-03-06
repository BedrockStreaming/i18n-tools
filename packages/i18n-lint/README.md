# i18n-lint

Linter for i18n translation files

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
