import _ from 'lodash';
import Reader from './reader';
import ConfigLoader from './configLoader';
import { validateHTML } from './verifiers/htmlVerifier';
import { validateJson } from './verifiers/jsonVerifier';
import { info } from './logger';

const reporters = { validateHTML, validateJson };

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
    const { mainLanguages, path } = this.config;

    const reports = _.flatMap(mainLanguages, lang => {
      const tradForLang = Reader.parse(path, `${lang}.json`);

      return _.compact(
        _.flatMap(reporters, (reporter, key) => {
          const reporterLevel = this.config.rules[key];
          if (reporterLevel === 'error') {
            return reporter(tradForLang, lang);
          } else if (reporterLevel === 'warning') {
            return reporter(tradForLang, lang, false);
          }

          return undefined;
        }),
      );
    });

    const { nbError, nbWarning } = _.reduce(
      reports,
      (acc, report) => {
        if (report.error) {
          acc.nbError += 1;
        } else {
          acc.nbWarning += 1;
        }

        return acc;
      },
      { nbError: 0, nbWarning: 0 },
    );

    if (nbError || nbWarning) {
      info(`${nbWarning} warning${nbWarning ? '' : 's'} found`);
      info(`${nbError} erro${nbError ? '' : 's'} found`);
    } else {
      info('Everything is fine');
    }

    process.exit(_.find(reports, { error: true }) ? 1 : 0);
  }
}
