import _get from 'lodash-es/get';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { sprintf } from 'sprintf-js';

export var translate = function translate(lang) {
  var i18nNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (key) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var number = arguments[2];

    var combineKey = key;
    // Pluralize
    if (typeof number !== 'undefined') {
      combineKey = key + '.' + (number < 2 ? 'one' : 'other');
    }

    var translation = _get(lang, combineKey, combineKey);

    return sprintf(translation, _extends({}, data, i18nNames));
  };
};

export var buildList = function buildList(lang) {
  return function (list, maxSize) {
    var separator = _get(lang, '_i18n.separator');
    var lastSeparator = _get(lang, '_i18n.and');

    if (!list || !list.length) {
      return '';
    }

    if (list.length === 1) {
      return list[0];
    }

    var lastIndex = list.length - 1;
    var subList = list.slice(0, lastIndex).join(separator);
    var result = '' + subList + lastSeparator + list[lastIndex];

    return result.length > maxSize ? result.substring(0, maxSize) + '...' : result;
  };
};