import _ from 'lodash';
import isHtml from 'is-html';
import { flatten } from './utils';
import { error, warn, info } from './logger';

const reportBuilder = (lang, key, message, value, isError) => {
  const log = isError ? error : warn;

  log(`${lang.toUpperCase()} - translation for key ${key} ${message} \n ${value} \n`);

  return { error: isError, message };
};

const getMatches = (string, regex, index = 1) => {
  const matches = [];
  let match;
  while ((match = regex.exec(string))) {
    matches.push(match[index]);
  }
  return matches;
};

const noMissingTag = string => {
  let openTags = [];
  let closedTags = [];

  _.forEach(getMatches(string, /<([a-zA-Z]+)>/g, 1), tag => {
    openTags.push(tag);
  });

  _.forEach(getMatches(string, /<\/([a-zA-Z]+)>/g, 1), tag => {
    closedTags.push(tag);
  });

  const tags = _.mergeWith(_.countBy(openTags), _.countBy(closedTags), (objValue, srcValue) => ({
    open: objValue || 0,
    closed: srcValue || 0,
  }));

  return _.every(tags, tag => tag.open && tag.closed && tag.open === tag.closed);
};

const rules = {
  htmlValid: {
    test: string => isHtml(`<p>${string}</p>`),
    message: 'is not html valid',
  },
  noMissingTag: {
    test: noMissingTag,
    message: 'has missing html tag',
  },
  doubleSpace: {
    test: string => !/(?:\s|\\u00a0){2}/.test(string),
    message: 'has double white space',
  },
  htmlDoubleSpace: {
    test: string => !/(?:\s|\\u00a0)<\/?[a-zA-Z]+>(?:\s|\\u00a0)/.test(string),
    message: 'has double white space with inner html tag',
  },
};

export default (langs, isError = true) => {
  const reports = [];
  _.forEach(langs, (lang, langName) => {
    info(`Starting lang ${langName.toUpperCase()} \n`);
    _.forEach(flatten(lang), (value, key) =>
      _.forEach(rules, ({ test, message }) => {
        if (!test(value)) {
          reports.push(reportBuilder(langName, key, message, value, isError));
        }
      }),
    );
  });

  return reports;
};
