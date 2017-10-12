import { PureComponent } from 'react';
import PropTypes from 'prop-types';

export class Trans extends PureComponent {
  componentDidMount() {
    this.update = () => this.forceUpdate();
    this.context.subscribe(this.update);
  }

  componentWillUnmount() {
    this.context.unsubscribe(this.update);
  }

  render() {
    const t = this.context.getTranslateFunction();

    return this.props.render({ t });
  }
}

Trans.propTypes = {
  render: PropTypes.func.isRequired,
};

Trans.contextTypes = {
  getTranslateFunction: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
};
