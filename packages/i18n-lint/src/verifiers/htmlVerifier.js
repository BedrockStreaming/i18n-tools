import _countBy from 'lodash/countBy';
import _every from 'lodash/every';
import _forEach from 'lodash/forEach';
import _mergeWith from 'lodash/mergeWith';
import isHtml from 'is-html';
import { flatten } from '../utils';
import { info } from '../logger';
import { reportBuilder } from '../reporters/reportBuilder';

const getMatches = (string, regex, index = 1) => {
  const matches = [];
  let match = regex.exec(string);
  while (match) {
    matches.push(match[index] ? match[index] : match[match.length - 1]);
    match = regex.exec(string);
  }

  return matches;
};

const noMissingTag = string => {
  const openTags = [];
  const closedTags = [];

  _forEach(getMatches(string, /<(\w+)[^/]*>|<(a)\s+href="\S+"[^/]*>/g, 1), tag => {
    openTags.push(tag);
  });

  _forEach(getMatches(string, /<\/([a-zA-Z]+)>/g, 1), tag => {
    closedTags.push(tag);
  });

  const tags = _mergeWith(_countBy(openTags), _countBy(closedTags), (objValue, srcValue) => ({
    open: objValue || 0,
    closed: srcValue || 0,
  }));

  return _every(tags, tag => tag.open && tag.closed && tag.open === tag.closed);
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

export const validateHTML = (jsonTree, lang, isError = true) => {
  const reports = [];

  info(`Starting lang ${lang.toUpperCase()} \n`);
  _forEach(flatten(jsonTree), (value, key) =>
    _forEach(rules, ({ test, message }) => {
      if (!test(value)) {
        reports.push(reportBuilder(lang, key, message, value, isError));
      }
    }),
  );

  return reports;
};
