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
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
  };

  beforeEach(() => {

    listeners = [];
    context = {
      getTranslateFunction: jest.fn(() => jest.fn(x => x)),
      subscribe: jest.fn(listener => listeners.push(listener)),
      unsubscribe: jest.fn(),
    };
  });

  it('should provide translate function and inherited props', () => {
    const wrapper = mount(<DummyComponent text="foo.bar" />, { context, childContextTypes });

    expect(mountToJson(wrapper)).toMatchSnapshot();
  });

  it('should subscribe to provider for lang update', () => {
    mount(<DummyComponent text="foo.bar" />, { context, childContextTypes });

    expect(context.subscribe).toBeCalledWith(jasmine.any(Function));
  });

  it('should unsubscribe from provider when unmounted', () => {
    const wrapper = mount(<DummyComponent text="foo.bar" />, { context, childContextTypes });

    wrapper.unmount();
    expect(context.unsubscribe).toBeCalledWith(jasmine.any(Function));
  });

  it('should rerender on update', () => {
    const firstTranslationFunction = jest.fn(x => x);
    const secondTranslationFunction = jest.fn(x => `**${x}**`);
    context.getTranslateFunction = jest.fn(() => firstTranslationFunction);

    const wrapper = mount(<DummyComponent text="foo.bar" />, { context, childContextTypes });

    context.getTranslateFunction.mockImplementation(() => secondTranslationFunction);
    expect(listeners.length).toBe(1);

    expect(mountToJson(wrapper)).toMatchSnapshot();
    listeners[0]();

    expect(mountToJson(wrapper)).toMatchSnapshot();
  });
});
