import { ipcMain } from "electron";

import { BoxHeroWindow, windowManager } from "../window";

const initNavigationIPC = () => {
  ipcMain.handle("history/go-back", () => {
    const focusedWindow = windowManager.getFocusedWindow(BoxHeroWindow);

    if (!focusedWindow) return;

    focusedWindow.webviewContents?.goBack();
  });

  ipcMain.handle("history/go-forward", () => {
    const focusedWindow = windowManager.getFocusedWindow(BoxHeroWindow);

    if (!focusedWindow) return;

    focusedWindow.webviewContents?.goForward();
  });

  ipcMain.handle("history/reload", () => {
    const focusedWindow = windowManager.getFocusedWindow(BoxHeroWindow);

    if (!focusedWindow) return;

    focusedWindow.webviewContents?.reload();
  });
};

export default initNavigationIPC;
