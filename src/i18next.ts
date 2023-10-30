/* eslint-disable import/no-named-as-default-member */
import i18n from "i18next";

import menu_en from "./locales/en/menu.json";
import menu_ko from "./locales/ko/menu.json";
import updater_en from "./locales/en/updater.json";
import updater_ko from "./locales/ko/updater.json";

export const initI18n = async () => {
  if (i18n.isInitialized) return;
  await i18n.init({
    ns: ["menu"],
    fallbackLng: "en",
    saveMissing: true,
    supportedLngs: ["en", "ko"],
  });

  i18n.addResourceBundle("en", "menu", menu_en);
  i18n.addResourceBundle("ko", "menu", menu_ko);
  i18n.addResourceBundle("en", "updater", updater_en);
  i18n.addResourceBundle("ko", "updater", updater_ko);
};

export default i18n;
