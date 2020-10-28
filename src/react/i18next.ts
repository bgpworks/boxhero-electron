import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../locales/en/react/common.json';
import ko from '../../locales/ko/react/common.json';
import { mainMethods } from './fromElectron';

const resources = {
  en: {
    translation: en,
  },
  ko: {
    translation: ko,
  },
};

i18n.on('initialized', () => {
  mainMethods.getAppLocale().then((locale) => {
    i18n.changeLanguage(locale);
  });
});

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  supportedLngs: ['en', 'ko'],
});

export default i18n;
