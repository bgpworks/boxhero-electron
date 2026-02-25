import i18n from "i18next";

import auth_en from "./en/auth.json";
import labelPrinter_en from "./en/labelPrinter.json";
import menu_en from "./en/menu.json";
import updater_en from "./en/updater.json";
import auth_ko from "./ko/auth.json";
import labelPrinter_ko from "./ko/labelPrinter.json";
import menu_ko from "./ko/menu.json";
import updater_ko from "./ko/updater.json";

export const initI18n = async () => {
  if (i18n.isInitialized) return;
  await i18n.init({
    ns: ["menu"],
    fallbackLng: "en",
    saveMissing: true,
    supportedLngs: ["en", "ko"],
  });

  i18n.addResourceBundle("en", "auth", auth_en);
  i18n.addResourceBundle("ko", "auth", auth_ko);
  i18n.addResourceBundle("en", "labelPrinter", labelPrinter_en);
  i18n.addResourceBundle("ko", "labelPrinter", labelPrinter_ko);
  i18n.addResourceBundle("en", "menu", menu_en);
  i18n.addResourceBundle("ko", "menu", menu_ko);
  i18n.addResourceBundle("en", "updater", updater_en);
  i18n.addResourceBundle("ko", "updater", updater_ko);
};

export default i18n;
