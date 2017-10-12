import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { mountToJson } from 'enzyme-to-json';
import { Trans } from '../i18n.component';

const DummyComponent = props => (
  <div>
    <Trans render={({ t }) => <span>{t(props.text)}</span>} />
  </div>
);
DummyComponent.propTypes = { text: PropTypes.string };

describe('i18n.renderProps', () => {
  let context;
  let listeners;
  const childContextTypes = {
    getTranslateFunction: PropTypes.func,
  };

  beforeEach(() => {
    listeners = [];
    context = {
      getTranslateFunction: jest.fn(() => jest.fn(x => x)),
    };
  });

  it('should provide translate function and inherited props', () => {
    const wrapper = mount(<DummyComponent text="foo.bar" />, { context, childContextTypes });

    expect(mountToJson(wrapper)).toMatchSnapshot();
  });
});
