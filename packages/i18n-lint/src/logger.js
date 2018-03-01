// TODO have better logger, with colors :D
export const error = (...args) => console.error('\x1b[31m', ...args);
export const warn = (...args) => console.warn('\x1b[33m', ...args);
