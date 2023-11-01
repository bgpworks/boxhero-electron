import { ipcMain } from "electron";

import { BoxHeroWindow, windowManager } from "../window";

const initWindowIPC = () => {
  ipcMain.handle("get-window-stat", () => {
    const focusedWindow = windowManager.getFocusedWindow(BoxHeroWindow);

    if (!focusedWindow) {
      return {};
    }

    return focusedWindow.windowStat;
  });

  ipcMain.handle("window-minimize", () => {
    const focusedWindow = windowManager.getFocusedWindow();

    if (!focusedWindow) return;

    focusedWindow.minimize();
  });

  ipcMain.handle("window-maximize", () => {
    const focusedWindow = windowManager.getFocusedWindow();

    if (!focusedWindow) return;

    focusedWindow.isMaximized()
      ? focusedWindow.unmaximize()
      : focusedWindow.maximize();
  });

  ipcMain.handle("window-close", () => {
    const focusedWindow = windowManager.getFocusedWindow();

    if (!focusedWindow) return;

    focusedWindow.close();
  });

  ipcMain.handle("window-toggle-maximize", () => {
    const focusedWindow = windowManager.getFocusedWindow();

    if (!focusedWindow) return;

    if (focusedWindow.isFullScreen()) {
      focusedWindow.setFullScreen(false);
    } else if (focusedWindow.isMaximized()) {
      focusedWindow.unmaximize();
    } else {
      focusedWindow.maximize();
    }
  });
};

export default initWindowIPC;
