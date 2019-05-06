import { currencyFunctions } from '../currency.utils';

describe('Currency utils', () => {
  ['fr', 'en', 'hu', 'hr'].forEach(locale => {
    it(`should format in '${locale}' currency`, () => {
      expect(currencyFunctions[locale](100000)).toMatchSnapshot();
    });
  });
});
