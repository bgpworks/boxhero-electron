/* eslint-disable import/no-named-as-default-member */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ko from "./locales/ko.json";

const resources = {
  en: {
    translation: en,
  },
  ko: {
    translation: ko,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "ko"],
  })
  .then(() => {
    window.electronAPI.main.getAppLocale().then((locale) => {
      i18n.changeLanguage(locale);
    });
  });

export default i18n;
