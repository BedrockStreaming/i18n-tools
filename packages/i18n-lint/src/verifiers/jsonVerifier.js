export const validateJson = jsonEntries => {
  const keys = Object.keys(jsonEntries);

  return keys.reduce((state, currentKey, index) => {
    const nextKey = keys[index + 1];

    if (nextKey && nextKey < currentKey) {
      state = [...state, { error: true, message: `current key ${currentKey} is bigger than its next key ${nextKey}` }];
    }

    if (typeof jsonEntries[currentKey] === 'object') {
      state = state.concat(validateJson(jsonEntries[currentKey]));
    }

    return state;
  }, []);
};
