import _ from 'lodash';
import isHtml from 'is-html';
import { flatten } from './utils';
import { error, warn } from './logger';

const reportBuilder = (message, isError) => {
  isError ? error(message) : warn(message);

  return { error: isError, message };
};


const getMatches = (string, regex, index = 1) => {
    const matches = [];
    let match;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
    }
    return matches;
};


const  noMissingTag = string => {
    let openTags = [];
    let closedTags = [];

    _.forEach(getMatches(string, /<([a-zA-Z]+)>/g, 1), tag => {
        openTags.push(tag);
    });

    _.forEach(getMatches(string, /<\/([a-zA-Z]+)>/g, 1), tag => {
        closedTags.push(tag);
    });

    const tags = _.mergeWith(
        _.countBy(openTags),
        _.countBy(closedTags),
        (objValue, srcValue) => ({open: objValue || 0, closed: srcValue || 0})
    );

    return _.every(tags, tag => tag.open && tag.closed && tag.open === tag.closed);
};

const rules = {
  htmlValid: {
    test: string => isHtml(`<p>${string}</p>`),
    report: (value, key, lang, isError) =>
        reportBuilder(
            `${lang}: translation for key '${key}' is not html valid \n  ${value}`,
            isError,
        ),
  },
  noMissingTag: {
    test: noMissingTag,
    report: (value, key, lang, isError) =>
        reportBuilder(
            `${lang}: translation for key '${key}' has missing html tag \n  ${value}`,
            isError,
        ),
  },
  doubleSpace: {
    test: string => !/(?:\s|\\u00a0){2}/.test(string),
    report: (value, key, lang, isError) =>
      reportBuilder(
          `${lang}: translation for key '${key}' has double white space \n  ${value}`,
          isError,
      ),

  },
  htmlDoubleSpace: {
    test: string => !/(?:\s|\\u00a0)<\/?[a-zA-Z]+>(?:\s|\\u00a0)/.test(string),
    report: (value, key, lang, isError) =>
      reportBuilder(
          `${lang}: translation for key '${key}' has double white space with inner html tag \n  ${value}`,
          isError,
      ),
  }
};

export default (langs, isError = true) => {
  const reports = []
  _.forEach(langs, (lang, langName) =>
    _.forEach(flatten(lang), (value, key) =>
      _.forEach(rules, ({ test, report }) => {
        if (!test(value)) {
          reports.push(report(value, key, langName, isError));
        }
      }),
    ),
  );

  return reports;
};
