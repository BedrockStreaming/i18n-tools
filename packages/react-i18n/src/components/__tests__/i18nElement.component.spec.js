import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import { HtmlTrans } from '../i18nElement.component';

describe('i18n.renderProps', () => {
  let context = {};
  const childContextTypes = {
    getTranslateFunction: PropTypes.func,
  };

  beforeEach(() => {
    context = {
      getTranslateFunction: jest.fn(() => jest.fn(x => `<div>${x}</div>`)),
    };
  });

  const getWrapper = (props) => shallow(<HtmlTrans i18nKey="foo.bar" {...props} />, { context, childContextTypes });

  it('should return html translation', () => {
    const wrapper = getWrapper();

    expect(wrapper).toMatchSnapshot();
  });

  it('should return html translation in a div', () => {
    const wrapper = getWrapper({ element: 'div' });

    expect(wrapper).toMatchSnapshot();
  });
});
