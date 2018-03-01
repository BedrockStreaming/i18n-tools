'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

var _logger = require('./logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reportBuilder = function reportBuilder(message, isError) {
  isError ? (0, _logger.error)(message) : (0, _logger.warn)(message);

  return { error: isError, message: message };
};

var rules = {
  nonOpenedTag: {
    regex: /^(?:(?!<[a-zA-Z]+>).)*(?:<\/[a-zA-Z]+>)+/,
    report: function report(value, key, lang, isError) {
      return reportBuilder(lang + ': translation for key \'' + key + '\' has an closing html tag without a opening one\n  ' + value, isError);
    }
  },
  nonClosedTag: {
    regex: /<[a-zA-Z]+>(?:(?!<\/[a-zA-Z]+>).)*$/,
    report: function report(value, key, lang, isError) {
      return reportBuilder(lang + ': translation for key \'' + key + '\' has an opening html tag without a closing one\n  ' + value, isError);
    }
  }
};

exports.default = function (langs) {
  var isError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var reports = [];

  _lodash2.default.forEach(langs, function (lang, langName) {
    return _lodash2.default.forEach((0, _utils.flatten)(lang), function (value, key) {
      return _lodash2.default.forEach(rules, function (_ref) {
        var regex = _ref.regex,
            report = _ref.report;

        if (regex.test(value)) {
          reports.push(report(value, key, langName, isError));
        }
      });
    });
  });

  return reports;
};