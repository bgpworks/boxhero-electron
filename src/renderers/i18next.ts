/* eslint-disable import/no-named-as-default-member */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import main_en from "./locales/en/main.json";
import main_ko from "./locales/ko/main.json";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  saveMissing: true,
  ns: ["main"],
  supportedLngs: ["en", "ko"],
});

i18n.addResourceBundle("en", "main", main_en);
i18n.addResourceBundle("ko", "main", main_ko);

export default i18n;
