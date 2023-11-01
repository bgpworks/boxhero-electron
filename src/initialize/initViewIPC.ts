import { ipcMain } from "electron";

import i18n from "../locales/i18next";
import { getMainMenu } from "../menu";
import { BoxHeroWindow, windowManager } from "../window";

export const initViewIPC = () => {
  ipcMain.handle("history-go-back", () => {
    const focusedWindow = windowManager.getFocusedWindow(BoxHeroWindow);

    if (!focusedWindow) return;

    focusedWindow.webviewContents?.goBack();
  });

  ipcMain.handle("history-go-forward", () => {
    const focusedWindow = windowManager.getFocusedWindow(BoxHeroWindow);

    if (!focusedWindow) return;

    focusedWindow.webviewContents?.goForward();
  });

  ipcMain.handle("history-refresh", () => {
    const focusedWindow = windowManager.getFocusedWindow(BoxHeroWindow);

    if (!focusedWindow) return;

    focusedWindow.webviewContents?.reload();
  });

  ipcMain.handle("open-main-menu", () => {
    getMainMenu(i18n).popup({
      x: 20,
      y: 38,
    });
  });
};
