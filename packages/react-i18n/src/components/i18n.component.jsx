import PropTypes from 'prop-types';

export const Trans = ({ render }, { getTranslateFunction }) => {
  const t = getTranslateFunction();

  return render({t});
};

Trans.propTypes = {
  render: PropTypes.func.isRequired,
};

Trans.contextTypes = {
  getTranslateFunction: PropTypes.func.isRequired,
};
