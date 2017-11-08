import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const translate = RenderComponent => {
  class TranslatedComponent extends Component {
    componentDidMount() {
      this.update = () => this.forceUpdate();
      this.context.subscribe(this.update);
    }

    componentWillUnmount() {
      this.context.unsubscribe(this.update);
    }

    render() {
      const t = this.context.getTranslateFunction();
      if (this.props.componentRef) {
        return <RenderComponent t={t} {...this.props} ref={element => this.props.componentRef(element)} />;
      }

      return <RenderComponent t={t} {...this.props} />;
    }
  }

  TranslatedComponent.propTypes = {
    componentRef: PropTypes.func,
  };

  TranslatedComponent.contextTypes = {
    getTranslateFunction: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
    unsubscribe: PropTypes.func.isRequired,
  };

  TranslatedComponent.fetchData = RenderComponent.fetchData;

  return TranslatedComponent;
};
