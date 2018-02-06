var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export var translate = function translate(RenderComponent) {
  var TranslatedComponent = function (_Component) {
    _inherits(TranslatedComponent, _Component);

    function TranslatedComponent() {
      _classCallCheck(this, TranslatedComponent);

      return _possibleConstructorReturn(this, (TranslatedComponent.__proto__ || Object.getPrototypeOf(TranslatedComponent)).apply(this, arguments));
    }

    _createClass(TranslatedComponent, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        this.update = function () {
          return _this2.forceUpdate();
        };
        this.context.subscribe(this.update);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.context.unsubscribe(this.update);
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var t = this.context.getTranslateFunction();
        if (this.props.componentRef) {
          return React.createElement(RenderComponent, _extends({ t: t }, this.props, { ref: function ref(element) {
              return _this3.props.componentRef(element);
            } }));
        }

        return React.createElement(RenderComponent, _extends({ t: t }, this.props));
      }
    }]);

    return TranslatedComponent;
  }(Component);

  TranslatedComponent.propTypes = {
    componentRef: PropTypes.func
  };

  TranslatedComponent.contextTypes = {
    getTranslateFunction: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
    unsubscribe: PropTypes.func.isRequired
  };

  TranslatedComponent.fetchData = RenderComponent.fetchData;

  return TranslatedComponent;
};