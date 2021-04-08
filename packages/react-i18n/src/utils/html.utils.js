import React from 'react';
import _ from 'lodash';

const upperCase = /^[A-Z]/;
const tagSearch = /(<.+?>)/;
const tagNameSearch = /<\/?([A-z]+)/;

const parseProps = props => {
  if (!props.length) {
    return null;
  }

  return _.compact(
    props.map(prop => {
      const [key, value = true] = prop.split('=');

      return key ? { key, value: typeof value === 'string' ? JSON.parse(value) : null } : null;
    }),
  );
};

const analyseTag = tag => {
  const isAutoClosing = tag[tag.length - 2] === '/';
  const isClosing = tag[1] === '/';
  const tagName = tagNameSearch.exec(tag)[1];
  const isReactComponent = upperCase.test(tagName);
  const props = isClosing
    ? null
    : parseProps(tag.slice(tag.indexOf(tagName) + tagName.length + 1, tag.length - (isAutoClosing ? 2 : 1)).split(' '));

  return {
    isAutoClosing,
    isClosing,
    isReactComponent,
    tagName,
    props,
    raw: tag,
  };
};

const buildTree = (elements, config = { currentIndex: 0 }, tree = [], currentTagName) => {
  while (config.currentIndex < elements.length) {
    const element = elements[config.currentIndex];

    // eslint-disable-next-line no-param-reassign,no-plusplus
    config.currentIndex++;

    if (typeof element === 'object') {
      if (element.isClosing && element.tagName === currentTagName) {
        return tree;
      }

      if (!element.isAutoClosing && !element.isClosing) {
        element.children = [];
        buildTree(elements, config, element.children, element.tagName);
      }
    }

    tree.push(element);
  }

  if (currentTagName) throw new Error(`Malformated HMTL, can't build proper render`);

  return tree;
};

const buildProps = (serialisedProps, key) => {
  const props = serialisedProps.reduce((acc, { key: propKey, value }) => ({ ...acc, [propKey]: value }), {});
  if (key) {
    props.key = key;
  }

  return props;
};

const getKey = (tagName, index) => {
  return `${tagName}-${index}`;
};

const renderer = (tree, renderers = {}) => {
  // Generate keys for React and HTML element in arrays
  const withKey = tree.length > 1;

  const map = tree.reduce((acc, node, index) => {
    const key = withKey && getKey(node.tagName, index);

    if (typeof node === 'object') {
      if (node.isReactComponent) {
        if (renderers[node.tagName]) {
          // React component
          acc.push(
            React.createElement(
              renderers[node.tagName],
              buildProps(node.props, key),
              node.isAutoClosing ? undefined : renderer(node.children, renderers),
            ),
          );
        } else {
          // Unknown React component, will be pushed without rendering
          acc.push(node.raw);
          if (node.children.length) {
            acc.push(renderer(node.children, renderers));
            acc.push(`</${node.tagName}>`);
          }
        }
      } else {
        // HTML element
        acc.push(
          React.createElement(
            node.tagName,
            buildProps(node.props, key),
            node.isAutoClosing ? undefined : renderer(node.children, renderers),
          ),
        );
      }
    } else {
      // Classic translation (string or number)
      acc.push(node);
    }

    return acc;
  }, []);

  // If a child is alone it shouldn't be in an array
  return map.length === 1 ? map[0] : map;
};

export const interpolateHTMLTags = (translation, renderers) => {
  const tags = _.compact(translation.split(tagSearch), x => x !== '').reduce(
    (acc, element) => acc.concat(element[0] === '<' ? analyseTag(element) : element),
    [],
  );

  if (tags.length === 1) return tags;

  try {
    const tree = buildTree(tags);

    return renderer(tree, renderers);
  } catch (error) {
    return translation;
  }
};
