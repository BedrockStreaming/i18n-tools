'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateJson = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reportBuilder = require('../reporters/reportBuilder');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var alphabeticRule = function alphabeticRule(lang, state, nodeIdentifier, nodeIndex, jsonEntry, keys) {
  var siblingNodeIdentifier = keys[nodeIndex + 1];

  if (siblingNodeIdentifier && siblingNodeIdentifier < nodeIdentifier) {
    return [].concat(_toConsumableArray(state), [(0, _reportBuilder.reportBuilder)(lang, nodeIdentifier, 'current key ' + nodeIdentifier + ' is bigger than its next key ' + siblingNodeIdentifier, nodeIdentifier, true)]);
  }

  return state;
};

var rules = [alphabeticRule];
var EMPTY_ARRAY = [];

var validateJson = exports.validateJson = function validateJson(jsonTree, lang) {
  var keys = Object.keys(jsonTree);

  return keys.reduce(function (state, nodeIdentifier, nodeIndex) {
    var nextState = _lodash2.default.flatMap(rules, function (rule) {
      return rule(lang, state, nodeIdentifier, nodeIndex, jsonTree, keys);
    });

    var currentNode = jsonTree[nodeIdentifier];

    if ((typeof currentNode === 'undefined' ? 'undefined' : _typeof(currentNode)) === 'object') {
      return [].concat(_toConsumableArray(nextState), _toConsumableArray(validateJson(currentNode, lang)));
    }

    return nextState;
  }, EMPTY_ARRAY);
};