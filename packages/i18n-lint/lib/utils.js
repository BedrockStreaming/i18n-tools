'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatten = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require('lodash');

var flatten = exports.flatten = function flatten(lang, path) {
  var accumulator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if ((typeof lang === 'undefined' ? 'undefined' : _typeof(lang)) === 'object') {
    (0, _lodash.forEach)(lang, function (value, key) {
      flatten(value, path ? path + '.' + key : key, accumulator);
    });
  } else {
    accumulator[path] = lang;
  }

  return accumulator;
};