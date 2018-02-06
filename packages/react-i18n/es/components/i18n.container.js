var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import PropTypes from 'prop-types';

export var translate = function translate(RenderComponent) {
  var TranslatedComponent = function TranslatedComponent(props, context) {
    var t = context.getTranslateFunction();

    if (props.componentRef) {
      return React.createElement(RenderComponent, _extends({ t: t }, props, { ref: function ref(element) {
          return props.componentRef(element);
        } }));
    }

    return React.createElement(RenderComponent, _extends({ t: t }, props));
  };

  TranslatedComponent.propTypes = {
    componentRef: PropTypes.func
  };

  TranslatedComponent.contextTypes = {
    getTranslateFunction: PropTypes.func.isRequired
  };

  TranslatedComponent.fetchData = RenderComponent.fetchData;
  TranslatedComponent.displayName = 'Translated(' + (RenderComponent.displayName || RenderComponent.name) + ')';

  return TranslatedComponent;
};