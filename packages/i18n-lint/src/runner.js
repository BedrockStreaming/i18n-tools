import _ from 'lodash';
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
      this.config = _.merge(config, ConfigLoader.load(configPath));
    } else {
      this.config = config;
    }
  }

  run() {
    const reports = this.config.mainLanguages.reduce((accumulator, lang) => {
      const tradForLang = Reader.parse(this.config.path, `${lang}.json`);

      const validatorReports = reporters.reduce((acc, validate) => acc.concat(validate(tradForLang, lang)), []);

      return accumulator.concat(validatorReports);
    }, []);

    process.exit(_.find(reports, { error: true }) ? 1 : 0);
  }
}
