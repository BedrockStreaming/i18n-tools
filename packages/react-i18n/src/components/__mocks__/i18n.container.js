import { translate as t } from '../../utils/i18n.utils';

export const translate = Component => {
  Component.defaultProps = { ...Component.defaultProps, t: t() };

  return Component;
};
