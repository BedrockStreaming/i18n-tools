import React from 'react';
import _ from 'lodash';
// import { translate as translateUtil } from '@m6web/i18n-translate';

// export { buildList } from '@m6web/i18n-translate';
const translateUtil = _.noop;

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

export const jsxRendererHandler = (translatedResult, renderers) => {
  const JSXTranslated = interpolateJSXInsideTranslation(translatedResult, renderers);

  return createComponentInstance(React.Fragment, JSXTranslated);
};

export const translate = (lang, i18nNames = {}, errorCallback = _.noop, renderersHandler = jsxRendererHandler) =>
  translateUtil(lang, i18nNames, errorCallback, renderersHandler);
