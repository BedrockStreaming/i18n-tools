# @m6web/react-i18n

[![Continous Integration](https://github.com/M6Web/i18n-tools/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/M6Web/i18n-tools/actions/workflows/continuous-integration.yml)
![npm](https://img.shields.io/npm/v/@m6web/react-i18n)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@m6web/react-i18n)
![npm](https://img.shields.io/npm/dy/@m6web/react-i18n)
![GitHub last commit](https://img.shields.io/github/last-commit/M6Web/i18n-tools)
![NPM](https://img.shields.io/npm/l/@m6web/react-i18n)


This library brings internationalisation through a set of react components.

The translation function is in **[i18n.utils.js](./src/utils/i18n.utils.js)** file.

It uses react context API to provide translation function to every components.

React version: `^16.4.0`

## Setup

First install the library

```shell
yarn add -E @m6web/react-i18n
```

Add the provider above a component to configure and provide translation function.

```jsx harmony
// Import the provider
import { I18nProvider } from '@m6web/react-i18n';

// Dictionnary for your app, you should have a different dictionary for each language
const translations = {
  foo: {
    bar: 'Foo bar',
    legal: 'App from %(company)s'
  }
};

// Global values used for interpolations in some translations like in the foo.legal key.
const i18nNames = {
  company: 'm6'
};

// Callback in case of missing translation
const errorCallback = console.warn;

// Put your app in the provider
const Root = () => (
  <I18nProvider lang={translations} i18nNames={i18nNames} errorCallback={errorCallback}>
    <App />
  </I18nProvider>
);
```

## Use translation components

### i18n String component

This component needs React 16 at least because its render returns a string value.

```jsx harmony
import React from 'react';
import { Trans } from '@m6web/react-i18n';

// Interpolation values
const data = { element: 'foo' };

export default const MyComponent = ({ nbExample, t }) => {
  return (
    <div class="foo">
      <h1>
        <Trans i18nKey="foo.bar" />
      </h1>
      <p>
        <Trans i18nKey="foo.exemple" number={nbExample} data={data} general/>
      </p>
    </div>
  );
};
```

* **i18nKeys**: key from the dictionary (required)
* **number**: amount used for plural forms
* **data**: object containing key/values used for interpolation in the translation
* **general**: use general plural form if truthy
* **renderers**: object containing the renderers to use to interpolate JSX (for more information see `JSX interpolation section`)

### i18n HTML component

```jsx harmony
import React from 'react';
import { HtmlTrans } from '@m6web/react-i18n';

// Interpolation values
const data = { element: 'foo' };

export default const MyComponent = ({ nbExample, t }) => {
  return (
    <div class="foo">
      <HtmlTrans i18nKey="foo.bar" element="h1" />
      <HtmlTrans i18nKey="foo.exemple" number={nbExample} data={data} general element="p" />
    </div>
  );
};
```

* **i18nKeys**: key from the dictionary (required)
* **number**: amount used for plural forms
* **data**: object containing key/values used for interpolation in the translation
* **general**: use general plural form if truthy
* **element**: HTML element, or React element used for rendering. (default value: `span`)
* **renderers**: object containing the renderers to use to interpolate JSX (for more information see `JSX interpolation section`)

Note that **number** and **data** can be used together.

### i18n container

This HOC provides the translate function to the component as prop.

```jsx harmony
import React from 'react';
import { translate } from '@m6web/react-i18n';

// Interpolation values
const data = { element: 'foo' };

const MyComponent = ({ nbExample, t }) => {
  return (
    <div class="foo">
      <h1>
        {t('foo.bar')}
      </h1>
      <p>
        {t('foo.exemple', data, nbExample, true)}
      </p>
    </div>
  );
};

export default translate(MyComponent);
```

* **t**: translation function, params are:
* **key**: key from the dictionary (required)
* **data**: object containing key/values used for interpolation in the translation
* **number**: amount used for plural forms
* **general**: use general plural form if truthy
* **renderers**: object containing the renderers to use to interpolate JSX (for more information see `JSX interpolation section`)

Note that **number** and **data** can be used together.

### useTranslate hook

This hook provides the `t` function in a functional component.

```jsx harmony
import React from 'react';
import { useTranslate } from '@m6web/react-i18n';

// Interpolation values
const data = { element: 'foo' };

export const MyComponent = ({ number }) => {
  const t = useTranslate();

  return (
    <div class="foo">
      <h1>{t('foo.bar')}</h1>
      <p>{t('foo.exemple', { data, number, general: true })}</p>
    </div>
  );
};
```

### BuildList

Build list function allows you to build a list in specific language.

```jsx harmony
import { buildListFunction } from '@m6web/react-i18n';

// Define separators with translations
const lang = {
  _i18n: {
    separator: ', ',
    and: ' and ',
  }
};

const list = buildListFunction(lang)(['foo', 'bar', 'foobar']);
// list => 'foo, bar and foobar'
```

### Pluralization

The translate function provided in the component and the container handle plural for several languages.

* FR (default value)
* EN
* HU
* HR

The lang has to be set through `_i18n.lang` key, and should be in lower case.
This is the configuration of plural form for keys:

| language | zero    | singular | general plural | first plural | second plural | third plural |
| -------- | ------- | -------- | -------------- | ------------ | ------------- | ------------ |
| EN       | `other` | `one`    | `other`        | `other`      | -             | -            |
| FR       | `one`   | `one`    | `other`        | `other`      | -             | -            |
| HR       | `many`  | `one`    | `other`        | `one`        | `few`         | `many`       |
| HU       | `one`   | `one`    | `other`        | `one`        | -             | -            |
| NL       | `other` | `one`    | `other`        | `other`      | -             | -            |

The variable used in translation template string has to be `%(number)d`, and is automatically provided by the translate function.

To use general form, you need to set 4th parameter of the translate function to `true`

### JSX Interpolation

It is possible to interpolate JSX components inside translation, to do so you have to give `renderers` parameter or props.
For example if you have in your translation : `foo <LinkToHome>bar</LinkToHome>` you should have a `LinkToHome` renderer.

```jsx harmony
import React from 'react';
import { useTranslate } from '@m6web/react-i18n';

const renderers = {
  LinkToHome: ({ children }) => <a href="/">{children}</a>,
};

const MyComponent = () => {
  const t = useTranslate();

  return (
    <div class="foo">
      <p>{t('foo.example', { renderers })}</p>
    </div>
  );
};
```

In this example, the `<LinkToHome>` inside your translation will be rendered by the component given in `renderers`.

For the moment only the children props are used by the renderer.

```jsx harmony
// Do
<Link>Home</Link>
<Link /> or <Link/>

// Don't
<Link href="/home">Home</Link>
```
