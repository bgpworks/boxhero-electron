import { app, Menu } from 'electron';
import { isDev } from './envs';
import i18n, { initI18n } from './i18next';
import log from 'electron-log';
import { getMainMenu } from './menu';

export const initLocale = () => {
  initI18n();

  i18n.on('initialized', () => {
    const appLocale = app.getLocale();
    i18n.changeLanguage(appLocale);

    if (isDev) {
      log.log('i18n 초기화됨.');
    }
  });

  i18n.on('languageChanged', (lng) => {
    const appMenu = getMainMenu(i18n);
    Menu.setApplicationMenu(appMenu);

    if (isDev) {
      log.log(`i18n 언어 변경됨. [${lng}]`);
    }
  });
};
