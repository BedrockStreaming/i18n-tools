#!/usr/bin/env node
import Runner from './runner';
import defaultConfig from '../default.config';

const runner = new Runner(defaultConfig);
runner.run();
