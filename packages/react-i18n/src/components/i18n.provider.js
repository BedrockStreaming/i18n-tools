import PropTypes from 'prop-types';
import { Component, Children } from 'react';
import { translate } from '../utils/i18n.utils';

export class I18nProvider extends Component {
  constructor(props, context) {
    super(props, context);
    this.translate = translate(this.props.lang, this.props.i18nNames);
  }

  getChildContext() {
    return {
      getTranslateFunction: () => this.translate,
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}

I18nProvider.propTypes = {
  children: PropTypes.element.isRequired,
  lang: PropTypes.object.isRequired,
  i18nNames: PropTypes.object,
};

I18nProvider.childContextTypes = {
  getTranslateFunction: PropTypes.func,
};
