import PropTypes from 'prop-types';
import { ReactI18n } from './i18n.context';

export const Trans = ({ i18nKey, data, number, general }) => {

  return <ReactI18n.consumer>{t => t(i18nKey, data, number, general)}</ReactI18n.consumer>;
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
