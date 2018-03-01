import _ from 'lodash';
import { flatten } from './utils';
import { error, warn } from './logger';

const reportBuilder = (message, isError) => {
  isError ? error(message) : warn(message);

  return { error: isError, message };
};

const rules = {
  nonOpenedTag: {
    regex: /^(?:(?!<[a-zA-Z]+>).)*(?:<\/[a-zA-Z]+>)+/,
    report: (value, key, lang, isError) =>
      reportBuilder(
        `${lang}: translation for key '${key}' has an closing html tag without a opening one\n  ${value}`,
        isError,
      ),
  },
  nonClosedTag: {
    regex: /<[a-zA-Z]+>(?:(?!<\/[a-zA-Z]+>).)*$/,
    report: (value, key, lang, isError) =>
      reportBuilder(
        `${lang}: translation for key '${key}' has an opening html tag without a closing one\n  ${value}`,
        isError,
      ),
  },
};

export default (langs, isError = true) => {
  const reports = [];

  _.forEach(langs, (lang, langName) =>
    _.forEach(flatten(lang), (value, key) =>
      _.forEach(rules, ({ regex, report }) => {
        if (regex.test(value)) {
          reports.push(report(value, key, langName, isError));
        }
      }),
    ),
  );

  return reports;
};
