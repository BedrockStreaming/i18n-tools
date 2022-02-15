import ConfigLoader from '../src/configLoader';

jest.unmock('../src/configLoader');
describe('ConfigLoader', () => {
  it('should work json content', () => {
    const config = ConfigLoader.load(`${__dirname}/data/file.json`);

    expect(config).toEqual({
      type: 'json',
    });
  });

  it('should work with js content', () => {
    const config = ConfigLoader.load(`${__dirname}/data/file.js`);

    expect(config).toEqual({
      type: 'js',
    });
  });

  it('should file to load any file', () => {
    const load = () => ConfigLoader.load(`${__dirname}/data/file.doc`);
    expect(load).toThrow(Error);
    expect(load).toThrow(`Unsupported extension : .doc`);
  });
});
