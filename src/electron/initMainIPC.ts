import {
  app,
  BrowserWindow,
  ipcMain,
  WebContents,
  webContents,
} from 'electron';
import { TitleBarNavStat } from '../@types/titlebar';
import { isMac } from './env';
import { menu } from './menu';

const getChildWebView = (parentWindow: BrowserWindow) => {
  const childView = webContents
    .getAllWebContents()
    .find(
      (wc) =>
        wc.getType() === 'webview' &&
        wc.hostWebContents === parentWindow.webContents
    );

  return childView;
};

export const initMainIPC = (mainWindow: BrowserWindow) => {
  ipcMain
    .removeAllListeners('minimize')
    .removeAllListeners('maximize')
    .removeAllListeners('close')
    .removeAllListeners('window-toggle-maximize');

  ipcMain.handle('window-minimize', () => mainWindow.minimize());

  ipcMain.handle('window-maximize', () =>
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
  );

  ipcMain.handle('window-close', () => {
    if (!isMac) {
      app.quit();
    } else {
      mainWindow.close();
    }
  });

  ipcMain.handle('window-toggle-maximize', () => {
    const isMaximized = mainWindow.isMaximized();

    if (isMaximized) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.handle('open-main-menu', () => {
    menu.popup({
      x: 20,
      y: 38,
    });
  });
};

const getNavStat = (webContents: WebContents): TitleBarNavStat => {
  const canGoBack = webContents.canGoBack();
  const canGoForward = webContents.canGoForward();

  return {
    canGoBack,
    canGoForward,
  };
};

export const initChildViewIPC = (mainWindow: BrowserWindow) => {
  const wrapperContents = mainWindow.webContents;

  wrapperContents.on('did-finish-load', () => {
    const webviewContents = getChildWebView(mainWindow);

    if (!webviewContents) return;

    const syncNavStat = () => {
      const navStat = getNavStat(webviewContents);
      wrapperContents.send('sync-nav-stat', navStat);
    };

    webviewContents
      .on('did-navigate', syncNavStat)
      .on('did-navigate-in-page', syncNavStat);

    ipcMain.handle('history-go-back', () => {
      webviewContents.goBack();
      syncNavStat();
    });

    ipcMain.handle('history-go-forward', () => {
      webviewContents.goForward();
      syncNavStat();
    });

    ipcMain.handle('history-refresh', () => {
      webviewContents.reload();
      syncNavStat();
    });
  });
};
