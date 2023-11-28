import _flatMap from 'lodash/flatMap';
import { reportBuilder } from '../reporters/reportBuilder';

const alphabeticRule = (lang, nodeIdentifier, nodeIndex, jsonEntry, keys) => {
  const siblingNodeIdentifier = keys[nodeIndex + 1];

  if (siblingNodeIdentifier && siblingNodeIdentifier < nodeIdentifier) {
    return [
      reportBuilder(
        lang,
        nodeIdentifier,
        `current key ${nodeIdentifier} is bigger than its next key ${siblingNodeIdentifier}`,
        nodeIdentifier,
        true,
      ),
    ];
  }

  return [];
};

const rules = [alphabeticRule];

export const validateJson = (jsonTree, lang) => {
  const keys = Object.keys(jsonTree);

  return _flatMap(keys, (nodeIdentifier, nodeIndex) => {
    const nextState = _flatMap(rules, rule => rule(lang, nodeIdentifier, nodeIndex, jsonTree, keys));
    const currentNode = jsonTree[nodeIdentifier];

    if (typeof currentNode === 'object') {
      return [...nextState, ...validateJson(currentNode, lang)];
    }

    return nextState;
  });
};
