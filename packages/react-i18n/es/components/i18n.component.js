import PropTypes from 'prop-types';

export var Trans = function Trans(_ref, _ref2) {
  var i18nKey = _ref.i18nKey,
      data = _ref.data,
      number = _ref.number,
      general = _ref.general;
  var getTranslateFunction = _ref2.getTranslateFunction;

  var t = getTranslateFunction();

  return t(i18nKey, data, number, general);
};

Trans.defaultProps = {
  data: {},
  number: undefined,
  general: false
};

Trans.proptypes = {
  i18nKey: PropTypes.string.isRequired,
  data: PropTypes.object,
  number: PropTypes.number,
  general: PropTypes.bool
};

Trans.contextTypes = {
  getTranslateFunction: PropTypes.func.isRequired
};