var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import { Component, Children } from 'react';
import { translate } from '../utils/i18n.utils';

export var I18nProvider = function (_Component) {
  _inherits(I18nProvider, _Component);

  function I18nProvider(props, context) {
    _classCallCheck(this, I18nProvider);

    var _this = _possibleConstructorReturn(this, (I18nProvider.__proto__ || Object.getPrototypeOf(I18nProvider)).call(this, props, context));

    _this.translate = translate(_this.props.lang, _this.props.i18nNames);
    return _this;
  }

  _createClass(I18nProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _this2 = this;

      return {
        getTranslateFunction: function getTranslateFunction() {
          return _this2.translate;
        }
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return Children.only(this.props.children);
    }
  }]);

  return I18nProvider;
}(Component);

I18nProvider.propTypes = {
  children: PropTypes.element.isRequired,
  lang: PropTypes.object.isRequired,
  i18nNames: PropTypes.object
};

I18nProvider.childContextTypes = {
  getTranslateFunction: PropTypes.func
};