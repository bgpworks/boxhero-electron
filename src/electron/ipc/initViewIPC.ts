import { BrowserWindow } from 'electron';
import i18n from '../i18next';
import { getMainMenu } from '../menu';
import { getChildWebView, getNavStat, setMainIPC } from './utils';

export const initViewIPC = (mainWindow: BrowserWindow) => {
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

    setMainIPC
      .handle('history-go-back', () => {
        webviewContents.goBack();
        syncNavStat();
      })
      .handle('history-go-forward', () => {
        webviewContents.goForward();
        syncNavStat();
      })
      .handle('history-refresh', () => {
        webviewContents.reload();
        syncNavStat();
      })
      .handle('open-main-menu', () => {
        getMainMenu(webviewContents, i18n).popup({
          x: 20,
          y: 38,
        });
      });
  });
};
