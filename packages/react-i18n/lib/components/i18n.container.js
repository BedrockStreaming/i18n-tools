'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.translate = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var translate = exports.translate = function translate(RenderComponent) {
  var TranslatedComponent = function TranslatedComponent(props, context) {
    var t = context.getTranslateFunction();

    if (props.componentRef) {
      return _react2.default.createElement(RenderComponent, _extends({ t: t }, props, { ref: function ref(element) {
          return props.componentRef(element);
        } }));
    }

    return _react2.default.createElement(RenderComponent, _extends({ t: t }, props));
  };

  TranslatedComponent.propTypes = {
    componentRef: _propTypes2.default.func
  };

  TranslatedComponent.contextTypes = {
    getTranslateFunction: _propTypes2.default.func.isRequired
  };

  TranslatedComponent.fetchData = RenderComponent.fetchData;

  return TranslatedComponent;
};