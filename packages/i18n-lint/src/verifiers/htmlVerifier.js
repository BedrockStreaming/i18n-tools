import _ from 'lodash';
import isHtml from 'is-html';
import { flatten } from '../utils';
import { info } from '../logger';
import { reportBuilder } from '../reporters/reportBuilder';

const getMatches = (string, regex, index = 1) => {
  const matches = [];
  let match = regex.exec(string);
  while (match) {
    matches.push(match[index]);
    match = regex.exec(string);
  }

  return matches;
};

const noMissingTag = string => {
  const openTags = [];
  const closedTags = [];

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

export default (jsonTree, lang, isError = true) => {
  const reports = [];

  info(`Starting lang ${lang.toUpperCase()} \n`);
  _.forEach(flatten(jsonTree), (value, key) =>
    _.forEach(rules, ({ test, message }) => {
      if (!test(value)) {
        reports.push(reportBuilder(lang, key, message, value, isError));
      }
    }),
  );

  return reports;
};
