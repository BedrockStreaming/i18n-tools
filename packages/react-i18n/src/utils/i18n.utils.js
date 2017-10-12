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
