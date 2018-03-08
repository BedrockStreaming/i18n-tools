'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _isHtml = require('is-html');

var _isHtml2 = _interopRequireDefault(_isHtml);

var _utils = require('./utils');

var _logger = require('./logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reportBuilder = function reportBuilder(message, isError) {
    isError ? (0, _logger.error)(message) : (0, _logger.warn)(message);

    return { error: isError, message: message };
};

var getMatches = function getMatches(string, regex) {
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    var matches = [];
    var match = void 0;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
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
        return { open: objValue || 0, closed: srcValue || 0 };
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
        report: function report(value, key, lang, isError) {
            return reportBuilder(lang + ': translation for key \'' + key + '\' is not html valid \n  ' + value, isError);
        }
    },
    noMissingTag: {
        test: noMissingTag,
        report: function report(value, key, lang, isError) {
            return reportBuilder(lang + ': translation for key \'' + key + '\' has missing html tag \n  ' + value, isError);
        }
    },
    doubleSpace: {
        test: function test(string) {
            return !/(?:\s|\\u00a0){2}/.test(string);
        },
        report: function report(value, key, lang, isError) {
            return reportBuilder(lang + ': translation for key \'' + key + '\' has double white space \n  ' + value, isError);
        }

    },
    htmlDoubleSpace: {
        test: function test(string) {
            return !/(?:\s|\\u00a0)<\/?[a-zA-Z]+>(?:\s|\\u00a0)/.test(string);
        },
        report: function report(value, key, lang, isError) {
            return reportBuilder(lang + ': translation for key \'' + key + '\' has double white space with inner html tag \n  ' + value, isError);
        }
    }
};

exports.default = function (langs) {
    var isError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var reports = [];
    _lodash2.default.forEach(langs, function (lang, langName) {
        return _lodash2.default.forEach((0, _utils.flatten)(lang), function (value, key) {
            return _lodash2.default.forEach(rules, function (_ref) {
                var test = _ref.test,
                    report = _ref.report;

                if (!test(value)) {
                    reports.push(report(value, key, langName, isError));
                }
            });
        });
    });

    return reports;
};