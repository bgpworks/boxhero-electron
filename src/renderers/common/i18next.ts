import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/common.json";
import ko from "./locales/ko/common.json";

const resources = {
  en: {
    translation: en,
  },
  ko: {
    translation: ko,
  },
};

i18n.on("initialized", () => {
  window.electronAPI.main.getAppLocale().then((locale) => {
    i18n.changeLanguage(locale);
  });
});

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  supportedLngs: ["en", "ko"],
});

export default i18n;
