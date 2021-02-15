import React from 'react';
import _ from 'lodash';
import { sprintf } from 'sprintf-js';

const pluralizeFunctions = {
  en: number => (number === 0 || number > 1 ? 'other' : 'one'),
  fr: number => (number > 1 ? 'other' : 'one'),
  hu: (number, general) => {
    if (!general) {
      return 'one';
    }

    return number > 1 ? 'other' : 'one';
  },
  hr: (number, general) => {
    // General plural
    if (general) {
      return number > 1 ? 'other' : 'one';
    }

    const numberInString = number.toString();
    const lastDigit = numberInString.charAt(numberInString.length - 1);

    if ((number > 4 && number < 21) || ['0', '5', '6', '7', '8', '9'].includes(lastDigit)) {
      // Third plural form
      return 'many';
    } else if (lastDigit === '1') {
      // First plural form and singular
      return 'one';
    } else if (lastDigit === '2' || lastDigit === '3' || lastDigit === '4') {
      // Second plural form
      return 'few';
    }

    return '';
  },
};

// find tags like : <Something>with content inside</Something>
const JSX_TAG_WITH_CONTENT_REGEX = /(.*?)<([A-Z]\w+)>(.*)<\/\2+>(.*)/;
// find tags like : <Something />
const SHORT_JSX_TAG_REGEX = /(.*?)<([A-Z]\w+) ?\/>(.*)/;

const parseJSX = content => {
  const regexResultTagWithContent = JSX_TAG_WITH_CONTENT_REGEX.exec(content);
  if (regexResultTagWithContent) {
    return {
      beforeTagContent: regexResultTagWithContent[1],
      componentTag: regexResultTagWithContent[2],
      insideTagContent: regexResultTagWithContent[3],
      afterTagContent: regexResultTagWithContent[4],
    };
  }

  const regexResultShortTag = SHORT_JSX_TAG_REGEX.exec(content);
  if (regexResultShortTag) {
    return {
      beforeTagContent: regexResultShortTag[1],
      componentTag: regexResultShortTag[2],
      afterTagContent: regexResultShortTag[3],
    };
  }

  return null;
};

const createComponentInstance = (component, children) => {
  if (!component) {
    return null;
  }

  return React.createElement(component, {}, ...(Array.isArray(children) ? children : [children]));
};

const interpolateJSXInsideTranslation = (translation, renderers) => {
  const parsingResult = parseJSX(translation);
  if (!parsingResult) {
    return translation;
  }

  const { beforeTagContent, componentTag, insideTagContent, afterTagContent } = parsingResult;
  const translationChildren = [];
  const interpolateAndAddToChildren = content => {
    const interpolatedContent = interpolateJSXInsideTranslation(content, renderers);

    if (typeof interpolatedContent === 'string') {
      translationChildren.push(interpolatedContent);
    }

    if (Array.isArray(interpolatedContent)) {
      translationChildren.push(...interpolatedContent);
    }
  };

  if (beforeTagContent) {
    interpolateAndAddToChildren(beforeTagContent);
  }

  if (componentTag) {
    const interpolatedChildren = insideTagContent ? interpolateJSXInsideTranslation(insideTagContent, renderers) : null;
    const rendererToUse = renderers[componentTag];
    const componentInstance = createComponentInstance(rendererToUse, interpolatedChildren);

    if (componentInstance) {
      translationChildren.push(componentInstance);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`No renderer provided for component "${componentTag}"`);
    }
  }

  if (afterTagContent) {
    interpolateAndAddToChildren(afterTagContent);
  }

  return translationChildren;
};

export const translate = (lang, i18nNames = {}, errorCallback = _.noop) => {
  const pluralize = pluralizeFunctions[_.get(lang, '_i18n.lang')] || pluralizeFunctions.fr;

  return (key, data = {}, number, general, renderers) => {
    let combineKey = key;
    // Pluralize
    if (typeof number !== 'undefined') {
      combineKey = `${key}.${pluralize(number, general)}`;
    }

    let translation;
    if (_.has(lang, combineKey)) {
      translation = _.get(lang, combineKey);
    } else {
      errorCallback(combineKey);
      translation = combineKey;
    }

    const translatedResult = sprintf(translation, { ...data, ...i18nNames, number });
    if (renderers) {
      const JSXTranslated = interpolateJSXInsideTranslation(translatedResult, renderers);

      return createComponentInstance(React.Fragment, JSXTranslated);
    }

    return translatedResult;
  };
};

export const buildList = lang => (list, maxSize) => {
  const separator = _.get(lang, '_i18n.separator');
  const lastSeparator = _.get(lang, '_i18n.and');

  if (!list || !list.length) {
    return '';
  }

  if (list.length === 1) {
    return list[0];
  }

  const lastIndex = list.length - 1;
  const subList = list.slice(0, lastIndex).join(separator);
  const result = `${subList}${lastSeparator}${list[lastIndex]}`;

  return result.length > maxSize ? `${result.substring(0, maxSize)}...` : result;
};
