'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Trans = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Trans = exports.Trans = function Trans(_ref, _ref2) {
  var i18nKey = _ref.i18nKey,
      data = _ref.data,
      number = _ref.number;
  var getTranslateFunction = _ref2.getTranslateFunction;

  var t = getTranslateFunction();

  return t(i18nKey, data, number);
};

Trans.defaultProps = {
  data: {},
  number: undefined
};

Trans.proptypes = {
  i18nKey: _propTypes2.default.string.isRequired,
  data: _propTypes2.default.object,
  number: _propTypes2.default.number
};

Trans.contextTypes = {
  getTranslateFunction: _propTypes2.default.func.isRequired
};