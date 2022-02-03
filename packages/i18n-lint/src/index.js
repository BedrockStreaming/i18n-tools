#!/usr/bin/env node
import Runner from './runner';
import ConfigLoader from './configLoader';

let defaultConfig;

const defaultConfigFile = ConfigLoader.detect();
if (defaultConfigFile) {
  try {
    defaultConfig = ConfigLoader.load(defaultConfigFile);
  } catch (e) {
    console.info('Error parsing .eslintrc.json or .eslintrc.js.');
  }
} else {
  console.info('No .eslintrc.json or .eslintrc.js was found. Using --config...');
}

const runner = new Runner(defaultConfig);
runner.run();
