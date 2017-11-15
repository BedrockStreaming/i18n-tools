export { translate as translateFunction } from './utils/i18n.utils';

const i18n = {};
if (__DEBUG_MODE__) {
  i18n.translate = require('./components/debug/i18n.container');
  i18n.Trans = require('./components/debug/i18n.component').default;
  i18n.I18nProvider = require('./components/debug/i18n.provider');
} else {
  i18n.translate = require('./components/i18n.container');
  i18n.Trans = require('./components/i18n.component').default;
  i18n.I18nProvider = require('./components/i18n.provider');
}

export default i18n;
