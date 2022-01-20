declare module '@m6web/react-i18n' {
  import { ElementType, Props } from 'react';

  interface TranslateFunctionOptions {
    data?: Record<string, any>;
    number?: number;
    general?: boolean;
    renderers?: Record<string, ElementType>;
  }

  type TranslateFunction = (key: string, options?: TranslateFunctionOptions) => string;

  interface I18nProviderProps {
    lang: Record<string, string>;

    i18nNames?: Record<string, string>;
    errorCallback?: (combineKey: string) => void;
    parseHTML?: boolean;
  }

  interface TransProps extends TranslateFunctionOptions {
    i18nKey: string;
  }

  interface HtmlTransProps extends TransProps {
    element: string | ElementType;
  }

  interface TranslateProps {
    t: TranslateFunction;
  }

  /* PUBLIC EXPORTS */

  function translate(component: ElementType): ElementType;

  function useTranslate(): TranslateFunction;

  function tFunction(
    lang: Record<string, string>,

    i18nNames?: Record<string, string>,
    errorCallback?: (combineKey: string) => void,
    parseHTML?: boolean,
  ): TranslateFunction;

  const I18nProvider: ElementType<I18nProviderProps>;

  const Trans: ElementType<TransProps>;

  const HtmlTrans: ElementType<HtmlTransProps>;
}
