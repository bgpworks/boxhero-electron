import path from 'path';
import { app, BrowserWindowConstructorOptions, BrowserView, BrowserWindow } from 'electron';

const syncWindowState = (window: BrowserWindow, view: BrowserView, yOffset = 38) => {
  view.setBounds({ ...window.getBounds(), x: 0, y: yOffset });
};

export const createMainWindow = (url: string, extOpts?: BrowserWindowConstructorOptions) => {
  const currentWindow = new BrowserWindow({
    ...(extOpts ? extOpts : {}),
  });

  let view = new BrowserView({
    webPreferences: {
      nativeWindowOpen: true,
      preload: path.resolve(app.getAppPath(), './out/preload.js'),
      devTools: true,
    },
  });

  currentWindow.loadFile(path.resolve(app.getAppPath(), './out/index.html'));
  view.webContents.loadURL(url);

  currentWindow.on('resize', () => {
    syncWindowState(currentWindow, view);
  });

  currentWindow.once('ready-to-show', () => {
    currentWindow.show();
  });

  currentWindow.once('show', () => {
    currentWindow.setBrowserView(view);
    syncWindowState(currentWindow, view);
  });

  return currentWindow;
};
