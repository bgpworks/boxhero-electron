import { BrowserWindow, WebContents } from "electron";
import log from "electron-log";

import i18n from "../i18next";
import { getContextMenu } from "../menu";
import { getViewState } from "../viewState";
import {
  startListener,
  stopListener,
  syncNavStat,
  syncWindowStat,
} from "./utils";

export const initViewEvents = () => {
  const { focusedWindow, targetContents } = getViewState();

  if (!focusedWindow || !targetContents) return;

  initWindowEvent(focusedWindow);
  initNavEvent(targetContents);
  initContextEvent(targetContents);
  initContentsEvent(targetContents);

  log.debug("ViewEvent updated.");
};

const initNavEvent = (targetContents: WebContents) => {
  targetContents.off("did-navigate", syncNavStat);
  targetContents.off("did-navigate-in-page", syncNavStat);

  targetContents
    .on("did-navigate", syncNavStat)
    .on("did-navigate-in-page", syncNavStat);
};

const initContentsEvent = (targetContents: WebContents) => {
  targetContents.off("did-start-loading", startListener);
  targetContents.off("did-stop-loading", stopListener);

  targetContents
    .on("did-start-loading", startListener)
    .on("did-stop-loading", stopListener);
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
