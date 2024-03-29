import _find from 'lodash/find';
import _flatMap from 'lodash/flatMap';
import _merge from 'lodash/merge';
import Reader from './reader';
import ConfigLoader from './configLoader';
import { validateHTML } from './verifiers/htmlVerifier';
import { validateJson } from './verifiers/jsonVerifier';

const reporters = [validateHTML, validateJson];

export default class Runner {
  constructor(defaultConfig) {
    this.init(defaultConfig);
  }

  init(config) {
    let configPath = './';
    const configIndex = process.argv.indexOf('--config') + 1;
    if (configIndex < process.argv.length && configIndex > 0) {
      configPath = process.argv[configIndex];
      this.config = _merge(config, ConfigLoader.load(configPath));
    } else {
      this.config = config;
    }
  }

  run() {
    const {
      settings: {
        i18n: { principalLangs = [], secondaryLangs = [] },
      },
    } = this.config;

    const reports = _flatMap([...principalLangs, ...secondaryLangs], ({ name, translationPath }) => {
      const tradForLang = Reader.parse(translationPath);

      return _flatMap(reporters, (reporter) => reporter(tradForLang, name));
    });

    process.exit(_find(reports, { error: true }) ? 1 : 0);
  }
}
