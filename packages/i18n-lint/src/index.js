#!/usr/bin/env node
import Runner from './runner';
import ConfigLoader from './configLoader';

let defaultConfig;

try {
  defaultConfig = ConfigLoader.load(`.eslintrc.json`);
} catch (e) {
  console.info('No .eslintrc.json was found. Using --config...');
}

const runner = new Runner(defaultConfig);
runner.run();
