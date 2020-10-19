import path from 'path';
import { app, BrowserWindow, Menu } from 'electron';
import { persistWindowState, getWindowState } from './utils/persistWindowState';
import { createMainWindow } from './window';
import { initMainIPC } from './initMainIPC';
import { isMac, isWindow } from './env';
import { contextMenu, menu } from './menu';

let mainWindow: BrowserWindow;

const initMainWindow = () => {
  const prevWindowState = getWindowState({
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 1024,
      height: 768,
    },
  });

  mainWindow = createMainWindow({
    ...prevWindowState.position,
    ...prevWindowState.size,
    minWidth: 500,
    title: 'BoxHero',
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      webviewTag: true,
      preload: path.resolve(
        app.getAppPath(),
        './out/preloads/wrapper-preload.js'
      ),
    },
    backgroundColor: '#282c42',
    ...(isWindow ? { frame: false } : { titleBarStyle: 'hiddenInset' }),
  });

  initMainIPC(mainWindow);
  persistWindowState(mainWindow);
};

app.on('ready', () => {
  initMainWindow();
  Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

app.on('activate', (_, hasVisibleWindows) => {
  if (!hasVisibleWindows) initMainWindow();
});

app.on('web-contents-created', (_, contents) => {
  if (contents.getType() == 'webview') {
    contents.on('context-menu', (_, { x, y }) =>
      contextMenu.popup({
        x,
        y,
      })
    );
  }
});
