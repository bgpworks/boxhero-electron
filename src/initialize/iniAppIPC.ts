import { app, ipcMain, shell } from "electron";

import i18n from "../locales/i18next";
import { getMainMenu } from "../menu";

const initAppIPC = () => {
  ipcMain.handle("open-main-menu", () => {
    getMainMenu(i18n).popup({
      x: 20,
      y: 38,
    });
  });

  ipcMain.handle("change-language", (_, lng: string) => {
    i18n.changeLanguage(lng);
  });

  ipcMain.handle("get-app-locale", () => app.getLocale());

  ipcMain.handle("open-external-link", (_, url: string) =>
    shell.openExternal(url)
  );
};

export default initAppIPC;
