import { app, ipcMain, shell } from "electron";

import i18n from "../locales/i18next";
import { checkIfActiveBoxHeroWindow } from "../utils";
import { windowRegistry } from "../window";

export const initWindowIPC = () => {
  ipcMain.handle("window-minimize", () => {
    const focusedWindow = windowRegistry.getFocusedWindow();

    focusedWindow.minimize();
  });

  ipcMain.handle("window-maximize", () => {
    const focusedWindow = windowRegistry.getFocusedWindow();

    focusedWindow.isMaximized()
      ? focusedWindow.unmaximize()
      : focusedWindow.maximize();
  });

  ipcMain.handle("window-close", () => {
    const focusedWindow = windowRegistry.getFocusedWindow();

    if (!focusedWindow || focusedWindow.isDestroyed()) return;

    focusedWindow.close();
  });

  ipcMain.handle("window-toggle-maximize", () => {
    const focusedWindow = windowRegistry.getFocusedWindow();

    if (focusedWindow.isFullScreen()) {
      focusedWindow.setFullScreen(false);
    } else if (focusedWindow.isMaximized()) {
      focusedWindow.unmaximize();
    } else {
      focusedWindow.maximize();
    }
  });

  ipcMain.handle("get-window-stat", () => {
    const focusedWindow = windowRegistry.getFocusedWindow();

    if (!checkIfActiveBoxHeroWindow(focusedWindow)) {
      return {};
    }

    return focusedWindow.windowStat;
  });

  ipcMain.handle("change-language", (_, lng: string) => {
    i18n.changeLanguage(lng);
  });

  ipcMain.handle("get-app-locale", () => app.getLocale());

  ipcMain.handle("open-external-link", (_, url: string) =>
    shell.openExternal(url)
  );
};
