/* eslint-disable react/prop-types */

import React from 'react';
import { mount } from 'enzyme';
import { translate, buildList } from '../i18n.utils';

describe('i18n translate function', () => {
  it('should return the key if the translation is missing', () => {
    expect(translate()('foo.bar')).toBe('foo.bar');
    expect(translate({})('foo.bar')).toBe('foo.bar');
  });

  it('should call the errorCallback if the translation is missing', () => {
    const errorCallback = jest.fn();
    expect(translate(undefined, undefined, errorCallback)('foo.bar')).toBe('foo.bar');
    expect(errorCallback).toBeCalledWith('foo.bar');
    expect(translate({}, undefined, errorCallback)('foo.foo')).toBe('foo.foo');
    expect(errorCallback).toBeCalledWith('foo.foo');
  });

  it('should return translation for a given key ', () => {
    const lang = { foo: { bar: 'foo bar!' } };
    expect(translate(lang)('foo.bar')).toBe('foo bar!');
  });

  it('should interpolate', () => {
    const lang = { foo: { bar: 'Hello %(name)s !' } };
    const t = translate(lang);
    expect(t('foo.bar', { data: { name: 'World' } })).toBe('Hello World !');
  });

  describe('with general plural', () => {
    it('should pluralize with default value', () => {
      const lang = { foo: { bar: { one: 'foo bar!', other: 'foos bars!!!' } } };
      const t = translate(lang);
      expect(t('foo.bar', {number: 0, general: true})).toBe('foo bar!');
      expect(t('foo.bar', {number: 1, general: true})).toBe('foo bar!');
      expect(t('foo.bar', {number: 2, general: true})).toBe('foos bars!!!');
    });

    it('should pluralize in french', () => {
      const lang = {
        foo: { bar: { one: 'foo bar!', other: 'foos bars!!!' } },
        _i18n: { lang: 'fr' },
      };
      const t = translate(lang);
      expect(t('foo.bar', {number: 0, general: true})).toBe('foo bar!');
      expect(t('foo.bar', {number: 1, general: true})).toBe('foo bar!');
      expect(t('foo.bar', {number: 2, general: true})).toBe('foos bars!!!');
    });

    it('should pluralize in english', () => {
      const lang = {
        foo: { bar: { one: 'foo bar!', other: 'foos bars!!!' } },
        _i18n: { lang: 'en' },
      };
      const t = translate(lang);
      expect(t('foo.bar', {number: 0, general: true})).toBe('foos bars!!!');
      expect(t('foo.bar', {number: 1, general: true})).toBe('foo bar!');
      expect(t('foo.bar', {number: 2, general: true})).toBe('foos bars!!!');
    });

    it('should pluralize in hungarian', () => {
      const lang = {
        foo: { bar: { one: 'foo bar!', other: 'foos bars!!!' } },
        _i18n: { lang: 'hu' },
      };
      const t = translate(lang);
      expect(t('foo.bar', {number: 0, general: true})).toBe('foo bar!');
      expect(t('foo.bar', {number: 1, general: true})).toBe('foo bar!');
      expect(t('foo.bar', {number: 2, general: true})).toBe('foos bars!!!');
    });

    it('should pluralize in croatian', () => {
      const lang = {
        foo: {
          bar: {
            other: 'general plural',
            one: 'first plural',
            few: 'second plural',
            many: 'third plural',
          },
        },
        _i18n: { lang: 'hr' },
      };
      const t = translate(lang);

      expect(t('foo.bar', {number: 0, general: true})).toBe('first plural');
      expect(t('foo.bar', {number: 1, general: true})).toBe('first plural');
      expect(t('foo.bar', {number: 2, general: true})).toBe('general plural');
    });

    it('should pluralize in dutch', () => {
      const lang = {
        foo: { bar: { one: 'foo bar!', other: 'foos bars!!!' } },
        _i18n: { lang: 'nl' },
      };
      const t = translate(lang);
      expect(t('foo.bar', {number: 0, general: true})).toBe('foos bars!!!');
      expect(t('foo.bar', {number: 1, general: true})).toBe('foo bar!');
      expect(t('foo.bar', {number: 2, general: true})).toBe('foos bars!!!');
    });

    it('should pluralize in german', () => {
      const lang = {
        foo: { bar: { one: 'foo bar!', other: 'foos bars!!!' } },
        _i18n: { lang: 'de' },
      };
      const t = translate(lang);
      expect(t('foo.bar', {number: 0, general: true})).toBe('foos bars!!!');
      expect(t('foo.bar', {number: 1, general: true})).toBe('foo bar!');
      expect(t('foo.bar', {number: 2, general: true})).toBe('foos bars!!!');
    });
  });

  describe('with number interpolation', () => {
    it('should pluralize with default value', () => {
      const lang = { foo: { bar: { one: '%(number)d foo bar!', other: '%(number)d foos bars!!!' } } };
      const t = translate(lang);
      expect(t('foo.bar', {number: 0})).toBe('0 foo bar!');
      expect(t('foo.bar', {number: 1})).toBe('1 foo bar!');
      expect(t('foo.bar', {number: 2})).toBe('2 foos bars!!!');
    });

    it('should pluralize in french', () => {
      const lang = {
        foo: { bar: { one: '%(number)d foo bar!', other: '%(number)d foos bars!!!' } },
        _i18n: { lang: 'fr' },
      };
      const t = translate(lang);
      expect(t('foo.bar', {number: 0})).toBe('0 foo bar!');
      expect(t('foo.bar', {number: 1})).toBe('1 foo bar!');
      expect(t('foo.bar', {number: 2})).toBe('2 foos bars!!!');
    });

    it('should pluralize in english', () => {
      const lang = {
        foo: { bar: { one: '%(number)d foo bar!', other: '%(number)d foos bars!!!' } },
        _i18n: { lang: 'en' },
      };
      const t = translate(lang);
      expect(t('foo.bar', {number: 0})).toBe('0 foos bars!!!');
      expect(t('foo.bar', {number: 1})).toBe('1 foo bar!');
      expect(t('foo.bar', {number: 2})).toBe('2 foos bars!!!');
    });

    it('should pluralize in english', () => {
      const lang = {
        foo: { bar: { one: '%(number)d foo bar!', other: '%(number)d foos bars!!!' } },
        _i18n: { lang: 'en' },
      };
      const t = translate(lang);
      expect(t('foo.bar', {number: 0})).toBe('0 foos bars!!!');
      expect(t('foo.bar', {number: 1})).toBe('1 foo bar!');
      expect(t('foo.bar', {number: 2})).toBe('2 foos bars!!!');
    });

    it('should pluralize in hungarian', () => {
      const lang = {
        foo: { bar: { one: '%(number)d foo bar!', other: '%(number)d foos bars!!!' } },
        _i18n: { lang: 'hu' },
      };
      const t = translate(lang);
      expect(t('foo.bar', {number: 0})).toBe('0 foo bar!');
      expect(t('foo.bar', {number: 1})).toBe('1 foo bar!');
      expect(t('foo.bar', {number: 2})).toBe('2 foo bar!');
    });

    it('should pluralize in croatian', () => {
      const lang = {
        foo: {
          bar: {
            one: '%(number)d first plural',
            few: '%(number)d second plural',
            many: '%(number)d third plural',
          },
        },
        _i18n: { lang: 'hr' },
      };
      const t = translate(lang);
      // first plural form
      [1, 21, 31, 41, 101].forEach(i => expect(t('foo.bar', {number: i})).toBe(`${i} first plural`));

      // second plural form
      [2, 3, 4, 22, 23, 24, 32, 33, 34].forEach(i => expect(t('foo.bar', {number: i})).toBe(`${i} second plural`));

      // third plural form
      for (let i = 5; i < 21; i++) {
        expect(t('foo.bar', {number: i})).toBe(`${i} third plural`);
      }
      [0, 25, 26, 27, 28, 29, 30, 35, 36, 37, 38, 39, 40, 45].forEach(i =>
        expect(t('foo.bar', {number: i})).toBe(`${i} third plural`),
      );
    });
  });

  describe('with JSX', () => {
    const Bold = ({ children }) => <strong>{children}</strong>;
    const Italic = ({ children }) => <em>{children}</em>;
    const LineBreak = () => <br />;

    it('should render the JSX component present inside the translation', () => {
      const lang = {
        foo: {
          bar: 'Hello <Bold>Moto</Bold> !',
        },
      };
      const renderers = { Bold };
      const t = translate(lang, undefined, undefined, true);

      const result = t('foo.bar', {renderers});
      const wrapper = mount(<div>{result}</div>);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render the nested JSX component present inside the translation', () => {
      const lang = {
        foo: {
          bar: 'Hello <Bold><Italic>Moto</Italic></Bold> !',
        },
      };
      const renderers = { Bold, Italic };
      const t = translate(lang, undefined, undefined, true);

      const result = t('foo.bar', { renderers });
      const wrapper = mount(<div>{result}</div>);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render the JSX component and sibling JSX component present inside the translation', () => {
      const lang = {
        foo: {
          bar: '<Italic>Hello</Italic> <Bold>Moto</Bold> !',
        },
      };
      const renderers = { Bold, Italic };
      const t = translate(lang, undefined, undefined, true);

      const result = t('foo.bar', {renderers});
      const wrapper = mount(<div>{result}</div>);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render the short (without children) JSX component inside the translation', () => {
      const lang = {
        foo: {
          bar: 'Hello<LineBreak />Moto<LineBreak/> !',
        },
      };
      const renderers = { LineBreak };
      const t = translate(lang, undefined, undefined, true);

      const result = t('foo.bar', {renderers});
      const wrapper = mount(<div>{result}</div>);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render a complex JSX structure inside the translation', () => {
      const lang = {
        foo: {
          bar: '<Bold><Italic>Hell</Italic>o</Bold><LineBreak />Moto<LineBreak/> !',
        },
      };
      const renderers = { LineBreak, Bold, Italic };
      const t = translate(lang, undefined, undefined, true);

      const result = t('foo.bar', {renderers});
      const wrapper = mount(<div>{result}</div>);

      expect(wrapper).toMatchSnapshot();
    });

    it('should return un-interpolated translation when a renderer is missing', () => {
      const lang = {
        foo: {
          bar: 'Hello <Bold><Italic>Moto</Italic></Bold> !',
        },
      };
      const t = translate(lang, undefined, undefined, true);

      expect(t('foo.bar', { renderers: {Bold} })).toMatchSnapshot();
      expect(t('foo.bar', { renderers: {Italic}  })).toMatchSnapshot();
    });

    it('should interpolate basic html tag', () => {
      const lang = {
        foo: {
          bar: '<em>Hello</em> <strong>Moto</strong> !',
        },
      };
      const renderers = {};
      const t = translate(lang, undefined, undefined, true);

      const result = t('foo.bar', { renderers});
      const wrapper = mount(<div>{result}</div>);

      expect(wrapper).toMatchSnapshot();
    });

    it('should works with badly formatted JSX', () => {
      const lang = {
        foo: {
          bar: '<Bold>Toto</Italic>',
        },
      };

      const renderers = { Bold, Italic };
      const t = translate(lang, undefined, undefined, true);

      const result = t('foo.bar', {renderers});
      const wrapper = mount(<div>{result}</div>);

      expect(wrapper).toMatchSnapshot();
    });

    it('should correctly render a big chunck of HTML', () => {
      const lang = {
        foo: {
          bar:
            '<h1>Test</h1>' +
            '<p>This is not what we wanna do with this lib but we need to ensure it works anyway</p>' +
            '<ul>' +
            '<li>simple link to <a href="https://github.com/M6Web/i18n-tools" target="_blank">the package</a>.</li>' +
            '<li>a disabled <button disabled>button</button></li>' +
            '<li>and an auto closing br <br /></li>' +
            '<script type="application/javascript">Some script I don\'t wanna see</script>' +
            '<iframe src="Some iframe I don\'t wanna see" />' +
            '</ul>',
        },
      };

      const t = translate(lang, undefined, undefined, true);
      const wrapper = mount(<div>{t('foo.bar')}</div>);

      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('i18n listBuilder function', () => {
  const lang = {
    _i18n: {
      separator: ', ',
      and: ' and ',
    },
  };

  const listBuilder = buildList(lang);

  it('should build list with only one element', () => {
    const list = ['foo'];

    expect(listBuilder(list)).toBe('foo');
  });

  it('should build list with two elemetns', () => {
    const list = ['foo', 'bar'];

    expect(listBuilder(list)).toBe('foo and bar');
  });

  it('should build list with more than two elements', () => {
    const list = ['foo', 'bar', 'foobar'];

    expect(listBuilder(list)).toBe('foo, bar and foobar');
  });
});
