export type SupportedLanguage = 'en' | 'te';

interface TranslationDictionary {
  [key: string]: {
    en: string;
    te: string;
  };
}

export const strings: TranslationDictionary = {
  home: { en: 'Home', te: 'హోమ్' },
  checkout: { en: 'Checkout', te: 'చెక్అవుట్' },
  customerNote: { en: 'Special Instructions (e.g., Clean and cut)', te: 'ప్రత్యేక సూచనలు (ఉదా: శుభ్రం చేసి కట్ చేయండి)' },
  fssaiNumber: { en: 'FSSAI License Number', te: 'FSSAI లైసెన్స్ నంబర్' },
};

export const t = (key: string, locale: SupportedLanguage = 'en'): string => {
  if (!strings[key]) return key;
  return strings[key][locale] || strings[key].en;
};
