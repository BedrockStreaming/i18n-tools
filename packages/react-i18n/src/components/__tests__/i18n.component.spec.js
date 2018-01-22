import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import { Trans } from '../i18n.component';

describe('i18n.renderProps', () => {
  let context = {};
  const childContextTypes = {
    getTranslateFunction: PropTypes.func,
  };

  beforeEach(() => {
    context = {
      getTranslateFunction: jest.fn(() => jest.fn(x => x)),
    };
  });

  it('should provide translate function and inherited props', () => {
    const wrapper = shallow(<Trans i18nKey="foo.bar" />, { context, childContextTypes });

    expect(wrapper).toMatchSnapshot();
  });
});
