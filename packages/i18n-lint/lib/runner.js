'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reader = require('./reader');

var _reader2 = _interopRequireDefault(_reader);

var _configLoader = require('./configLoader');

var _configLoader2 = _interopRequireDefault(_configLoader);

var _htmlVerifier = require('./verifiers/htmlVerifier');

var _jsonVerifier = require('./verifiers/jsonVerifier');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var reporters = [_htmlVerifier.validateHTML, _jsonVerifier.validateJson];

var Runner = function () {
  function Runner(defaultConfig) {
    _classCallCheck(this, Runner);

    this.init(defaultConfig);
  }

  _createClass(Runner, [{
    key: 'init',
    value: function init(config) {
      var configPath = './';
      var configIndex = process.argv.indexOf('--config') + 1;
      if (configIndex < process.argv.length && configIndex > 0) {
        configPath = process.argv[configIndex];
        this.config = _lodash2.default.merge(config, _configLoader2.default.load(configPath));
      } else {
        this.config = config;
      }
    }
  }, {
    key: 'run',
    value: function run() {
      var _config = this.config,
          mainLanguages = _config.mainLanguages,
          path = _config.path;


      var reports = _lodash2.default.flatMap(mainLanguages, function (lang) {
        var tradForLang = _reader2.default.parse(path, lang + '.json');

        return _lodash2.default.flatMap(reporters, function (reporter) {
          return reporter(tradForLang, lang);
        });
      });

      process.exit(_lodash2.default.find(reports, { error: true }) ? 1 : 0);
    }
  }]);

  return Runner;
}();

exports.default = Runner;