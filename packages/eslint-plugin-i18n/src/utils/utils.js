const fs = require('fs');
const path = require('path');
const minimatch = require('minimatch');

const recursiveGet = (object, keys, index) => {
  if (keys.length - index === 1) {
    return object[keys[index]];
  }

  return object[keys[index]] ? recursiveGet(object[keys[index]], keys, index + 1) : undefined;
};

exports.has = (object, key) => !!recursiveGet(object, key.split('.'), 0);

exports.get = (object, key) => recursiveGet(object, key.split('.'), 0);

exports.getKeyValue = key => {
  if (key.type === 'Literal') {
    return key.value;
  } else if (key.type === 'TemplateLiteral' && key.quasis.length === 1) {
    return key.quasis[0].value.cooked;
  }

  return null;
};

const expireAt = {};
const langConfig = {};

exports.getLangConfig = (config, languagesKey) => {
  if (!expireAt[languagesKey] || expireAt[languagesKey] <= Date.now() || config.disableCache) {
    langConfig[languagesKey] = config[languagesKey].map(({ name, translationPath }) => {
      try {
        const langFile = JSON.parse(fs.readFileSync(path.resolve(`${process.cwd()}/${translationPath}`)).toString());

        return {
          name,
          translation: langFile,
        };
      } catch (e) {
        return {
          name,
          translation: null,
        };
      }
    });
    expireAt[languagesKey] = Date.now() + (config.translationsCacheTTL || 500);
  }

  return langConfig[languagesKey];
};

const useTranslateParams = ['count'];

exports.getTranslateParams = node => {
  if (!node || !node.properties) {
    return {};
  }

  const params = node.properties.reduce((acc, property) => {
    if (useTranslateParams.includes(property.key.name)) {
      return Object.assign(acc, { [property.key.name]: property });
    }

    return acc;
  }, {});

  // Pour react-i18next, count est utilisé comme countNode
  if (params.count) {
    params.number = params.count;
  }

  // Pour react-i18next, toutes les propriétés en dehors de count sont des variables
  const variableParams = node.properties.filter(property =>
    !useTranslateParams.includes(property.key.name)
  );

  // S'il y a des variables directes, on considère qu'il y a des données
  if (variableParams.length > 0) {
    params.data = { hasVariables: true };
  }

  return params;
};

exports.isFileIgnored = (fileName, config) => {
  if (!config || !config.ignoreFiles) return false;

  return [].concat(config.ignoreFiles).some(ignorePath => minimatch(fileName, ignorePath));
};
