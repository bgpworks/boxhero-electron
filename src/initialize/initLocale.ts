import { app, Menu } from "electron";
import log from "electron-log";

import i18n, { initI18n } from "../i18next";
import { getMainMenu } from "../menu";

export const initLocale = async () => {
  await initI18n();

  i18n.on("languageChanged", (lng) => {
    const appMenu = getMainMenu(i18n);
    Menu.setApplicationMenu(appMenu);

    log.debug(`i18n language changed. [${lng}]`);
  });

  const appLocale = app.getLocale();
  await i18n.changeLanguage(appLocale);
};
