const alphabeticRule = (state, currentKey, currentIndex, jsonEntry, keys) => {
  const nextKey = keys[currentIndex + 1];

  if (nextKey && nextKey < currentKey) {
    return [...state, { error: true, message: `current key ${currentKey} is bigger than its next key ${nextKey}` }];
  }

  return state;
};

const rules = [alphabeticRule];

export const validateJson = jsonEntries => {
  const keys = Object.keys(jsonEntries);

  return keys.reduce((state, currentKey, index) => {
    const nextState = rules.reduce((acc, rule) => [...acc, ...rule(state, currentKey, index, jsonEntries, keys)], []);

    if (typeof jsonEntries[currentKey] === 'object') {
      return [...nextState, ...validateJson(jsonEntries[currentKey])];
    }

    return nextState;
  }, []);
};
