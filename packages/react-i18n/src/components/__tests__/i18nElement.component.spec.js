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

  it('should return html translation', () => {
    const wrapper = shallow(<HtmlTrans i18nKey="foo.bar" />, { context, childContextTypes });

    expect(wrapper).toMatchSnapshot();
  });

  it('should return html translation in a div', () => {
    const wrapper = shallow(<HtmlTrans i18nKey="foo.bar" element="div" />, { context, childContextTypes });

    expect(wrapper).toMatchSnapshot();
  });
});
