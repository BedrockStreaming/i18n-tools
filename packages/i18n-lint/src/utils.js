import { forEach } from 'lodash';

export const flatten = (lang, path, accumulator = {}) => {
  if (typeof lang === 'object') {
    forEach(lang, (value, key) => {
      flatten(value, path ? `${path}.${key}` : key, accumulator);
    });
  } else {
    accumulator[path] = lang;
  }

  return accumulator;
};
