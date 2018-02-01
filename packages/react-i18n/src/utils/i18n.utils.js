import _ from 'lodash';
import { sprintf } from 'sprintf-js';

export const translate = (lang, i18nNames = {}) => (key, data = {}, number) => {
  let combineKey = key;
  // Pluralize
  if (typeof number !== 'undefined') {
    combineKey = `${key}.${number < 2 ? 'one' : 'other'}`;
  }

  const translation = _.get(lang, combineKey, combineKey);

  return sprintf(translation, { ...data, ...i18nNames });
};

export const buildList = lang => (list, maxSize) => {
  const separator = _.get(lang, '_i18n.separator');
  const lastSeparator = _.get(lang, '_i18n.and');

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
