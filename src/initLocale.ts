import { app, Menu } from "electron";
import logger from "electron-log";

import i18n, { initI18n } from "./i18next";
import { getMainMenu } from "./menu";

export const initLocale = async () => {
  await initI18n();

  i18n.on("languageChanged", (lng) => {
    const appMenu = getMainMenu(i18n);
    Menu.setApplicationMenu(appMenu);

    logger.debug(`i18n language changed. [${lng}]`);
  });

  const appLocale = app.getLocale();
  await i18n.changeLanguage(appLocale);
};
