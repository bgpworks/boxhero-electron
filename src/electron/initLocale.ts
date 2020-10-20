import { app, BrowserWindow, Menu } from 'electron';
import i18n, { initI18n } from './i18next';
import { getChildWebView } from './ipc/utils';
import { getContextMenu, getMainMenu } from './menu';

export const initLocale = (mainWindow: BrowserWindow) => {
  initI18n();

  i18n.on('initialized', () => {
    const appLocale = app.getLocale();
    i18n.changeLanguage(appLocale);
  });

  i18n.on('languageChanged', () => {
    const childView = getChildWebView(mainWindow)!;

    childView.removeAllListeners('context-menu');
    childView.on('context-menu', (_, { x, y }) => {
      getContextMenu(i18n).popup({
        x,
        y,
      });
    });

    const appMenu = getMainMenu(childView, i18n);
    Menu.setApplicationMenu(appMenu);
  });
};
