'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.translate = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sprintfJs = require('sprintf-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var translate = exports.translate = function translate(lang) {
  var i18nNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (key) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var number = arguments[2];

    var combineKey = key;
    // Pluralize
    if (typeof number !== 'undefined') {
      combineKey = key + '.' + (number < 2 ? 'one' : 'other');
    }

    var translation = _lodash2.default.get(lang, combineKey, combineKey);

    return (0, _sprintfJs.sprintf)(translation, _extends({}, data, i18nNames));
  };
};