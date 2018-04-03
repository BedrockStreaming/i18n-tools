import chalk from 'chalk';

export const error = (...args) => console.error(chalk.red('ERROR', ...args));
export const warn = (...args) => console.warn(chalk.yellow('WARN', ...args));
export const info = (...args) => console.info(chalk.blue(...args));
