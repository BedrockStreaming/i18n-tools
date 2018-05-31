export const validateJson = jsonEntries => {
  let reports = [];

  const keys = Object.keys(jsonEntries);

  keys.forEach((currentKey, index) => {
    const nextKey = keys[index + 1];

    if (nextKey && nextKey < currentKey) {
      reports.push({ error: true, message: `current key ${currentKey} is bigger than its next key ${nextKey}` });
    }

    if (typeof jsonEntries[currentKey] === 'object') {
      reports = reports.concat(validateJson(jsonEntries[currentKey]));
    }
  });

  return reports;
};
