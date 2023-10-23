/* eslint-disable import/no-named-as-default-member */
import i18n from "i18next";

import en from "./locales/en/menu.json";
import ko from "./locales/ko/menu.json";

export const initI18n = async () => {
  if (i18n.isInitialized) return;
  await i18n.init({
    ns: ["menu"],
    fallbackLng: "en",
    saveMissing: true,
    supportedLngs: ["en", "ko"],
  });

  i18n.addResourceBundle("en", "menu", en);
  i18n.addResourceBundle("ko", "menu", ko);
};

export default i18n;
