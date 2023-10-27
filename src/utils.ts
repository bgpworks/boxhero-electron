import { BrowserWindow, WebContents } from "electron";

import { TitleBarNavStat, TitleBarWindowStat } from "./types/titlebar";
import { BoxHeroWindow } from "./window";

export const getNavStat = (webContents: WebContents): TitleBarNavStat => {
  const canGoBack = webContents.canGoBack();
  const canGoForward = webContents.canGoForward();

  return {
    canGoBack,
    canGoForward,
  };
};

export const getWindowStat = (window: BrowserWindow): TitleBarWindowStat => {
  const isMaximized = window.isMaximized();
  const isFullScreen = window.isFullScreen();

  return {
    isMaximized,
    isFullScreen,
  };
};

export function checkIfBoxHeroWindow(
  window: BrowserWindow
): window is BoxHeroWindow {
  return window instanceof BoxHeroWindow;
}

export function checkIfActiveBoxHeroWindow(
  window: BrowserWindow
): window is BoxHeroWindow {
  return !window.isDestroyed() && checkIfBoxHeroWindow(window);
}
