import _ from 'lodash';
import { reportBuilder } from '../reporters/reportBuilder';

const alphabeticRule = (lang, state, nodeIdentifier, nodeIndex, jsonEntry, keys) => {
  const siblingNodeIdentifier = keys[nodeIndex + 1];

  if (siblingNodeIdentifier && siblingNodeIdentifier < nodeIdentifier) {
    return [
      ...state,
      reportBuilder(
        lang,
        nodeIdentifier,
        `current key ${nodeIdentifier} is bigger than its next key ${siblingNodeIdentifier}`,
        nodeIdentifier,
        true,
      ),
    ];
  }

  return state;
};

const rules = [alphabeticRule];
const EMPTY_ARRAY = [];

export const validateJson = (jsonTree, lang) => {
  const keys = Object.keys(jsonTree);

  return keys.reduce((state, nodeIdentifier, nodeIndex) => {
    const nextState = _.flatMap(rules, rule => rule(lang, state, nodeIdentifier, nodeIndex, jsonTree, keys));
    const currentNode = jsonTree[nodeIdentifier];

    if (typeof currentNode === 'object') {
      return [...nextState, ...validateJson(currentNode, lang)];
    }

    return nextState;
  }, EMPTY_ARRAY);
};
