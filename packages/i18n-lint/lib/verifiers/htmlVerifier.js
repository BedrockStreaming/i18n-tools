'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateHTML = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _isHtml = require('is-html');

var _isHtml2 = _interopRequireDefault(_isHtml);

var _utils = require('../utils');

var _logger = require('../logger');

var _reportBuilder = require('../reporters/reportBuilder');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getMatches = function getMatches(string, regex) {
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var matches = [];
  var match = regex.exec(string);
  while (match) {
    matches.push(match[index]);
    match = regex.exec(string);
  }

  return matches;
};

var noMissingTag = function noMissingTag(string) {
  var openTags = [];
  var closedTags = [];

  _lodash2.default.forEach(getMatches(string, /<([a-zA-Z]+)>/g, 1), function (tag) {
    openTags.push(tag);
  });

  _lodash2.default.forEach(getMatches(string, /<\/([a-zA-Z]+)>/g, 1), function (tag) {
    closedTags.push(tag);
  });

  var tags = _lodash2.default.mergeWith(_lodash2.default.countBy(openTags), _lodash2.default.countBy(closedTags), function (objValue, srcValue) {
    return {
      open: objValue || 0,
      closed: srcValue || 0
    };
  });

  return _lodash2.default.every(tags, function (tag) {
    return tag.open && tag.closed && tag.open === tag.closed;
  });
};

var rules = {
  htmlValid: {
    test: function test(string) {
      return (0, _isHtml2.default)('<p>' + string + '</p>');
    },
    message: 'is not html valid'
  },
  noMissingTag: {
    test: noMissingTag,
    message: 'has missing html tag'
  },
  doubleSpace: {
    test: function test(string) {
      return !/(?:\s|\\u00a0){2}/.test(string);
    },
    message: 'has double white space'
  },
  htmlDoubleSpace: {
    test: function test(string) {
      return !/(?:\s|\\u00a0)<\/?[a-zA-Z]+>(?:\s|\\u00a0)/.test(string);
    },
    message: 'has double white space with inner html tag'
  }
};

var validateHTML = exports.validateHTML = function validateHTML(jsonTree, lang) {
  var isError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var reports = [];

  (0, _logger.info)('Starting lang ' + lang.toUpperCase() + ' \n');
  _lodash2.default.forEach((0, _utils.flatten)(jsonTree), function (value, key) {
    return _lodash2.default.forEach(rules, function (_ref) {
      var test = _ref.test,
          message = _ref.message;

      if (!test(value)) {
        reports.push((0, _reportBuilder.reportBuilder)(lang, key, message, value, isError));
      }
    });
  });

  return reports;
};