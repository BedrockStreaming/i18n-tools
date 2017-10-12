export const translate = () => (key, interpolation, count) => {
  const results = [key];

  if (interpolation) {
    results.push(`with ${JSON.stringify(interpolation)}`);
  }

  if (count || count === 0) {
    results.push(`for ${count}`);
  }

  return results.join(' ');
};
