'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reportBuilder = undefined;

var _logger = require('../logger');

var reportBuilder = exports.reportBuilder = function reportBuilder(lang, key, message, value, isError) {
  var log = isError ? _logger.error : _logger.warn;

  log(lang.toUpperCase() + ' - translation for key ' + key + ' ' + message + ' \n ' + value + ' \n');

  return { error: isError, message: message };
};