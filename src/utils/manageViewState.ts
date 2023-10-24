import { BrowserWindow, webContents, WebContents } from "electron";
import log from "electron-log";

import i18n from "../i18next";
import { syncNavStat, syncWindowStat } from "../ipc/utils";
import { getContextMenu } from "../menu";

interface ICurrentViewState {
  focusedWindow?: BrowserWindow;
  wrapperContents?: WebContents;
  targetContents?: WebContents;
  mainWindows: BrowserWindow[];
}

const currentViewState: ICurrentViewState = {
  mainWindows: [],
};

export const getViewState = (): ICurrentViewState => {
  const { wrapperContents, targetContents, focusedWindow, mainWindows } =
    currentViewState;
  return {
    wrapperContents,
    targetContents,
    focusedWindow,
    mainWindows,
  };
};

export const updateViewState = (window: BrowserWindow) => {
  const wrapperContents = window.webContents;
  const childViewContents = getChildWebView(window);
  const targetContents = childViewContents || wrapperContents;

  currentViewState.focusedWindow = window;
  currentViewState.wrapperContents = wrapperContents;
  currentViewState.targetContents = targetContents;

  log.debug(`ViewState updated.`);
};

export const initViewEvents = () => {
  const { focusedWindow, targetContents } = getViewState();

  if (!focusedWindow || !targetContents) return;

  initWindowEvent(focusedWindow);
  initNavEvent(targetContents);
  initContextEvent(targetContents);

  log.debug("ViewEvent updated.");
};

const initNavEvent = (targetContents: WebContents) => {
  targetContents.off("did-navigate", syncNavStat);
  targetContents.off("did-navigate-in-page", syncNavStat);

  targetContents
    .on("did-navigate", syncNavStat)
    .on("did-navigate-in-page", syncNavStat);
};

const initWindowEvent = (targetWindow: BrowserWindow) => {
  targetWindow.off("resize", syncWindowStat);
  targetWindow.on("resize", syncWindowStat);
};

const initContextEvent = (targetContents: WebContents) => {
  targetContents.removeAllListeners("context-menu");
  targetContents.on("context-menu", (_, { x, y }) => {
    getContextMenu(i18n).popup({
      x,
      y,
    });
  });
};

const getChildWebView = (parentWindow: BrowserWindow) => {
  const childView = webContents
    .getAllWebContents()
    .find(
      (wc) =>
        wc.getType() === "webview" &&
        wc.hostWebContents === parentWindow.webContents
    );

  return childView;
};
