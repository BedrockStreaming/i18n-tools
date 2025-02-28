import _get from 'lodash/get';
import _has from 'lodash/has';
import _noop from 'lodash/noop';
import { sprintf } from 'sprintf-js';
import { interpolateHTMLTags } from './html.utils';

const pluralizeFunctions = {
  de: number => (number === 1 ? 'one' : 'other'),
  en: number => (number === 1 ? 'one' : 'other'),
  fr: number => (number > 1 ? 'other' : 'one'),
  hr: (number, general) => {
    // General plural
    if (general) {
      return number > 1 ? 'other' : 'one';
    }

    const numberInString = number.toString();
    const lastDigit = numberInString.charAt(numberInString.length - 1);

    if ((number > 4 && number < 21) || ['0', '5', '6', '7', '8', '9'].includes(lastDigit)) {
      // Third plural form
      return 'many';
    } else if (lastDigit === '1') {
      // First plural form and singular
      return 'one';
    } else if (lastDigit === '2' || lastDigit === '3' || lastDigit === '4') {
      // Second plural form
      return 'few';
    }

    return '';
  },
  hu: (number, general) => {
    if (!general) {
      return 'one';
    }

    return number > 1 ? 'other' : 'one';
  },
  nl: number => (number === 1 ? 'one' : 'other'),
};

export const translate = (lang, i18nNames = {}, errorCallback = _noop, parseHTML = false) => {
  const pluralize = pluralizeFunctions[_get(lang, '_i18n.lang')] || pluralizeFunctions.fr;

  return (key, { data = {}, number, general, renderers } = {}) => {
    let combineKey = key;
    // Pluralize
    if (typeof number !== 'undefined') {
      combineKey = `${key}.${pluralize(number, general)}`;
    }

    let translation;
    if (_has(lang, combineKey)) {
      translation = _get(lang, combineKey);
    } else {
      errorCallback(combineKey);
      translation = combineKey;
    }

    const translatedResult = sprintf(translation, { ...data, ...i18nNames, number });

    if (!parseHTML) return translatedResult;

    const htmlTags = interpolateHTMLTags(translatedResult, renderers);
    if (htmlTags.length > 1) return htmlTags;

    return translatedResult;
  };
};

export const buildList = lang => (list, maxSize) => {
  const separator = _get(lang, '_i18n.separator');
  const lastSeparator = _get(lang, '_i18n.and');

  if (!list || !list.length) {
    return '';
  }

  if (list.length === 1) {
    return list[0];
  }

  const lastIndex = list.length - 1;
  const subList = list.slice(0, lastIndex).join(separator);
  const result = `${subList}${lastSeparator}${list[lastIndex]}`;

  return result.length > maxSize ? `${result.substring(0, maxSize)}...` : result;
};
