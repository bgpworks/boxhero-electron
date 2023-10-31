import { BrowserWindow } from "electron";

import { BoxHeroWindow } from "./window";

export function checkIfBoxHeroWindow(
  window: BrowserWindow
): window is BoxHeroWindow {
  return window instanceof BoxHeroWindow;
}

export function checkIfActiveBoxHeroWindow(
  window: BrowserWindow
): window is BoxHeroWindow {
  return window && !window.isDestroyed() && checkIfBoxHeroWindow(window);
}
