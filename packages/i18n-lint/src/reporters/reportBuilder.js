import { error, warn } from '../logger';

export const reportBuilder = (lang, key, message, value, isError) => {
  const log = isError ? error : warn;

  log(`${lang.toUpperCase()} - translation for key ${key} ${message} \n ${value} \n`);

  return { error: isError, message };
};
