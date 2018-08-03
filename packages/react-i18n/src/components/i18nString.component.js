import PropTypes from 'prop-types';

export const Trans = ({ i18nKey, data, number, general }, { getTranslateFunction }) => {
  const t = getTranslateFunction();

  return t(i18nKey, data, number, general);
};

Trans.defaultProps = {
  data: {},
  number: undefined,
  general: false,
};

Trans.proptypes = {
  i18nKey: PropTypes.string.isRequired,
  data: PropTypes.object,
  number: PropTypes.number,
  general: PropTypes.bool,
};

Trans.contextTypes = {
  getTranslateFunction: PropTypes.func.isRequired,
};