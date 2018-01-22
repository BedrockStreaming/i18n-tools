import PropTypes from 'prop-types';

export const Trans = ({ i18nKey, data, number }, { getTranslateFunction }) => {
  const t = getTranslateFunction();

  return t(i18nKey, data, number);
};

Trans.defaultProps = {
  data: {},
  number: undefined,
};

Trans.proptypes = {
  i18nKey: PropTypes.string.isRequired,
  data: PropTypes.object,
  number: PropTypes.number,
};

Trans.contextTypes = {
  getTranslateFunction: PropTypes.func.isRequired,
};
