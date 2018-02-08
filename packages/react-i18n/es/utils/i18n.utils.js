import _get from 'lodash-es/get';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { sprintf } from 'sprintf-js';

var numberPlaceholder = '%(number)';

var pluralizeFunctions = {
  en: function en(number) {
    return number === 0 || number > 1 ? 'other' : 'one';
  },
  fr: function fr(number) {
    return number > 1 ? 'other' : 'one';
  },
  hu: function hu(number, general) {
    if (!general) {
      return 'one';
    }

    return number > 1 ? 'other' : 'one';
  },
  hr: function hr(number, general) {
    // General plural
    if (general) {
      return number > 1 ? 'other' : 'one';
    }

    var numberInString = number.toString();
    var lastDigit = numberInString.charAt(numberInString.length - 1);

    if (number > 4 && number < 21 || ['0', '5', '6', '7', '8', '9'].includes(lastDigit)) {
      // Third plural form
      return 'many';
    } else if (lastDigit === '1') {
      // First plural form and singular
      return 'one';
    } else if (lastDigit === '2' || lastDigit === '3' || lastDigit === '4') {
      // Second plural form
      return 'few';
    }
  }
};

export var translate = function translate(lang) {
  var i18nNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var pluralize = pluralizeFunctions[_get(lang, '_i18n.lang')] || pluralizeFunctions.fr;

  return function (key) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var number = arguments[2];
    var general = arguments[3];

    var combineKey = key;
    // Pluralize
    if (typeof number !== 'undefined') {
      combineKey = key + '.' + pluralize(number, general);
    }

    var translation = _get(lang, combineKey, combineKey);

    return sprintf(translation, _extends({}, data, i18nNames, { number: number }));
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