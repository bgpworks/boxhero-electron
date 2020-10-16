import path from 'path';
import { app, BrowserWindowConstructorOptions, BrowserView, BrowserWindow } from 'electron';
import { initMainIPC } from './mainEventListeners';

interface IWindows {
  mainWindow?: BrowserWindow;
  mainView?: BrowserView;
}

export const windows: IWindows = {};

const syncWindowState = (window: BrowserWindow, view: BrowserView, yOffset = 38) => {
  view.setBounds({ ...window.getBounds(), x: 0, y: yOffset });
};

export const createMainWindow = (url: string, extOpts?: BrowserWindowConstructorOptions) => {
  const currentWindow = new BrowserWindow({
    ...(extOpts ? extOpts : {}),
  });

  const currentView = new BrowserView({
    webPreferences: {
      nativeWindowOpen: true,
      preload: path.resolve(app.getAppPath(), './out/preload.js'),
      devTools: true,
    },
  });

  currentWindow.loadFile(path.resolve(app.getAppPath(), './out/index.html'));
  currentView.webContents.loadURL(url);

  currentWindow.on('resize', () => {
    syncWindowState(currentWindow, currentView);
  });

  currentWindow.once('ready-to-show', () => {
    currentWindow.show();
  });

  currentWindow.once('show', () => {
    currentWindow.setBrowserView(currentView);
    syncWindowState(currentWindow, currentView);
    initMainIPC();
  });

  windows.mainWindow = currentWindow;
  windows.mainView = currentView;

  return currentWindow;
};
