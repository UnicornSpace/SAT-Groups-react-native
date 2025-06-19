import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import kan from './locales/kan.json';
import tam from './locales/tam.json';
import tel from './locales/tel.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      kan: { translation: kan },
      tam: { translation: tam },
      tel: { translation: tel }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react:{
      useSuspense: false
    }
  })
  .then(() => console.log('✅ i18n initialized successfully'))
  .catch((error) => console.log('❌ i18n initialization failed:', error));

export default i18n;
