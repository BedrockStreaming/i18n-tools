import PropTypes from 'prop-types';

export const Trans = ({ i18nKey, data, number, general }, { getTranslateFunction }) => {
  const t = getTranslateFunction();

  return t(i18nKey, data, number, general);
};

Trans.defaultProps = {
  data: {},
  general: false,
};

Trans.propTypes = {
  i18nKey: PropTypes.string.isRequired,
  data: PropTypes.object,
  number: PropTypes.number,
  general: PropTypes.bool,
};

Trans.contextTypes = {
  getTranslateFunction: PropTypes.func.isRequired,
};
