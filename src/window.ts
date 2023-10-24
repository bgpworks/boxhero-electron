import { app, BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import log from "electron-log";
import path from "path";

import { isDev, isWindow } from "./envs";
import { getViewState, setUpdateWindow } from "./utils/manageViewState";
import { getWindowState, persistWindowState } from "./utils/persistWindowState";

export const openBoxHero = () => {
  const prevWindowState = getWindowState({
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 1200,
      height: 800,
    },
  });

  const { mainWindows } = getViewState();

  const newWindow = createMainWindow({
    ...prevWindowState.size,
    ...(mainWindows.length > 0 ? getNextPosition() : prevWindowState.position),
    minWidth: 1000,
    minHeight: 562,
    title: "BoxHero",
    webPreferences: {
      devTools: isDev,
      webviewTag: true,
      preload: path.join(__dirname, "preload.js"),
    },
    backgroundColor: "#282c42",
    ...(isWindow ? { frame: false } : { titleBarStyle: "hiddenInset" }),
  });

  newWindow.webContents.once("did-finish-load", () => {
    persistWindowState(newWindow);
  });

  log.debug(
    `new boxhero window opened [currently ${mainWindows.length} windows opened]`
  );
};

export const openUpdateWindow = () => {
  const { updateWindow } = getViewState();
  if (updateWindow) return;

  const newUpdateWindow = new BrowserWindow({
    width: 320,
    height: 240,
    alwaysOnTop: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  newUpdateWindow.setMenuBarVisibility(false);
  newUpdateWindow.loadFile(path.resolve(app.getAppPath(), "./out/update.html"));

  newUpdateWindow.webContents.once("did-finish-load", () => {
    newUpdateWindow.show();
  });

  newUpdateWindow
    .once("show", () => {
      log.debug("update window opened");
    })
    .once("close", () => {
      setUpdateWindow();
      log.debug("update window closed");
    });

  setUpdateWindow(newUpdateWindow);

  return newUpdateWindow;
};

const getNextPosition = () => {
  const { focusedWindow } = getViewState();

  if (!focusedWindow || !isMainWindow(focusedWindow)) return {};

  const { x, y } = focusedWindow.getBounds();

  return { x: x + 50, y: y + 50 };
};

export const createMainWindow = (extOpts?: BrowserWindowConstructorOptions) => {
  const currentWindow = new BrowserWindow({
    ...(extOpts ? extOpts : {}),
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    currentWindow.loadURL(
      `${MAIN_WINDOW_VITE_DEV_SERVER_URL}/templates/index.html`
    );
  } else {
    currentWindow.loadFile(
      path.join(
        __dirname,
        `../renderer/${MAIN_WINDOW_VITE_NAME}/templates/index.html`
      )
    );
  }

  currentWindow.once("ready-to-show", () => {
    currentWindow.show();
  });

  if (isDev) {
    currentWindow.webContents.openDevTools();
  }

  addToMainWindowGroup(currentWindow);
  return currentWindow;
};

const addToMainWindowGroup = (targetWindow: BrowserWindow) => {
  const { mainWindows } = getViewState();

  mainWindows.push(targetWindow);

  targetWindow.once("close", () => {
    const findedIndex = mainWindows.findIndex(
      (window) => window === targetWindow
    );

    mainWindows.splice(findedIndex, 1);

    log.debug(
      `boxhero window closed [currently ${mainWindows.length} windows opened]`
    );
  });
};

export const isMainWindow = (target: BrowserWindow) => {
  const { mainWindows } = getViewState();

  return mainWindows.includes(target);
};
