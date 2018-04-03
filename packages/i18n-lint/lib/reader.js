'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSONReader = function () {
  function JSONReader() {
    _classCallCheck(this, JSONReader);
  }

  _createClass(JSONReader, null, [{
    key: 'parse',
    value: function parse(folderName, fileName) {
      try {
        var path = folderName + '/' + fileName;

        var text = _fs2.default.readFileSync(path, 'utf-8');

        return JSON.parse(text);
      } catch (e) {
        console.log('######## error', e);

        return null;
      }
    }
  }]);

  return JSONReader;
}();

exports.default = JSONReader;