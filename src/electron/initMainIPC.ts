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
    .removeAllListeners('close');

  ipcMain
    .on('minimize', () => mainWindow.minimize())
    .on('maximize', () =>
      mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
    )
    .on('close', () => {
      if (!isMac) {
        app.quit();
      } else {
        mainWindow.close();
      }
    })
    .on('open-main-menu', () => {
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
    const childView = getChildWebView(mainWindow);

    if (!childView) return;

    const syncNavStat = () => {
      const navStat = getNavStat(childView);
      wrapperContents.send('sync-nav-stat', navStat);
    };

    childView
      .on('did-navigate', syncNavStat)
      .on('did-navigate-in-page', syncNavStat);

    ipcMain.handle('history-go-back', () => {
      childView.goBack();
      syncNavStat();
    });

    ipcMain.handle('history-go-forward', () => {
      childView.goForward();
      syncNavStat();
    });

    ipcMain.handle('history-refresh', () => {
      childView.reload();
      syncNavStat();
    });
  });
};
