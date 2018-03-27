'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = exports.warn = exports.error = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var error = exports.error = function error() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return console.error(_chalk2.default.red.apply(_chalk2.default, ['ERROR'].concat(args)));
};
var warn = exports.warn = function warn() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return console.warn(_chalk2.default.yellow.apply(_chalk2.default, ['WARN'].concat(args)));
};
var info = exports.info = function info() {
  return console.info(_chalk2.default.blue.apply(_chalk2.default, arguments));
};