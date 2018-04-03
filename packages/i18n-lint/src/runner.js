import _ from 'lodash';
import Reader from './reader';
import ConfigLoader from './configLoader';
import validateHTML from './htmlVerifier';

export default class Runner {
  constructor(defaultConfig) {
    this.init(defaultConfig);
  }

  init(config) {
    let configPath = './';
    const configIndex = process.argv.indexOf('--config') + 1;
    if (configIndex < process.argv.length && configIndex > 0) {
      configPath = process.argv[configIndex];
      this.config = _.merge(config, new ConfigLoader().load(configPath));
    } else {
      this.config = config;
    }
  }

  run() {
    const mainLanguages = this.config.mainLanguages.reduce((accumulator, lang) => {
      accumulator[lang] = new Reader().parse(this.config.path, `${lang}.json`);

      return accumulator;
    }, {});

    const htmlReports = validateHTML(mainLanguages);

    process.exit(_.find(htmlReports, { error: true }) ? 1 : 0);
  }
}
