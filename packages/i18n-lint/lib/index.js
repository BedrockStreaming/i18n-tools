'use strict';

var _runner = require('./runner');

var _runner2 = _interopRequireDefault(_runner);

var _default = require('../default.config');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var runner = new _runner2.default(_default2.default);
runner.run();