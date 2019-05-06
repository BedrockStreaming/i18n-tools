const currencyBuilder = (locale, currency) => new Intl.NumberFormat(locale, { style: 'currency', currency }).format;

export const currencyFunctions = {
  fr: currencyBuilder('fr-FR', 'EUR'),
  en: currencyBuilder('us-EN', 'USD'),
  hu: currencyBuilder('hu-HU', 'HUF'),
  hr: currencyBuilder('hr-HR', 'HRK'),
};
