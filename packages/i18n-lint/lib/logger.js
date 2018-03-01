'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// TODO have better logger, with colors :D
var error = exports.error = function error() {
  var _console;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (_console = console).error.apply(_console, ['\x1b[31m'].concat(args));
};
var warn = exports.warn = function warn() {
  var _console2;

  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return (_console2 = console).warn.apply(_console2, ['\x1b[33m'].concat(args));
};