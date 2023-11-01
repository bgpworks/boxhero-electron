import { app } from "electron";
import log from "electron-log";

import i18n, { initI18n } from "../locales/i18next";
import initMenu from "./initMenu";

const initLocale = async () => {
  await initI18n();

  i18n.on("languageChanged", (lng) => {
    log.debug(`i18n language changed. [${lng}]`);
    initMenu();
  });

  const appLocale = app.getLocale();
  await i18n.changeLanguage(appLocale);
};

export default initLocale;
