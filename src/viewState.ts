import { BrowserWindow, webContents, WebContents } from "electron";
import log from "electron-log";

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
