import PropTypes from 'prop-types';
import { translate } from '../utils/i18n.utils';
import { ReactI18n } from './i18n.context';

export const I18nProvider = ({ children, lang, i18nNames }) => (
  <ReactI18n.provider value={translate(lang, i18nNames)}>{children}</ReactI18n.provider>
);

I18nProvider.propTypes = {
  children: PropTypes.element.isRequired,
  lang: PropTypes.object.isRequired,
  i18nNames: PropTypes.object,
};
