declare module '@m6web/react-i18n' {
    import { ElementType } from 'react';

    type TranslateRenderers = Record<string, ElementType>;
    type TranslateFunction = (
      key: string,
      data: Record<string, any>,
      number: number,
      general: boolean,
      renderers: TranslateRenderers,
    ) => string;

    interface TranslateFunctionOptions {
      data?: Record<string, any>;
      number?: number;
      general?: boolean;
      renderers?: TranslateRenderers;
    }

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

    type useTranslateFunction = (key: string, options?: TranslateFunctionOptions) => string;

    /* PUBLIC EXPORTS */

    function translate(component: ElementType): ElementType;

    function useTranslate(): useTranslateFunction;

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
