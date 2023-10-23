/* eslint-disable import/no-named-as-default-member */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ko from "./locales/ko.json";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  saveMissing: true,
  ns: ["main"],
  supportedLngs: ["en", "ko"],
});

i18n.addResourceBundle("en", "main", en);
i18n.addResourceBundle("ko", "main", ko);

export default i18n;
