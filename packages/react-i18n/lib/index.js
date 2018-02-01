'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18n = require('./utils/i18n.utils');

Object.defineProperty(exports, 'translateFunction', {
  enumerable: true,
  get: function get() {
    return _i18n.translate;
  }
});
Object.defineProperty(exports, 'buildListFunction', {
  enumerable: true,
  get: function get() {
    return _i18n.buildList;
  }
});

var _i18n2 = require('./components/i18n.container');

Object.defineProperty(exports, 'translate', {
  enumerable: true,
  get: function get() {
    return _i18n2.translate;
  }
});

var _i18n3 = require('./components/i18n.component');

Object.defineProperty(exports, 'Trans', {
  enumerable: true,
  get: function get() {
    return _i18n3.Trans;
  }
});

var _i18n4 = require('./components/i18n.provider');

Object.defineProperty(exports, 'I18nProvider', {
  enumerable: true,
  get: function get() {
    return _i18n4.I18nProvider;
  }
});