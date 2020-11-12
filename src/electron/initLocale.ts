import { app, Menu } from 'electron';
import i18n, { initI18n } from './i18next';
import logger from 'electron-log';
import { getMainMenu } from './menu';

export const initLocale = () => {
  initI18n();

  i18n.on('initialized', () => {
    const appLocale = app.getLocale();
    i18n.changeLanguage(appLocale);

    logger.debug('i18n initialized.');
  });

  i18n.on('languageChanged', (lng) => {
    const appMenu = getMainMenu(i18n);
    Menu.setApplicationMenu(appMenu);

    logger.debug(`i18n language changed. [${lng}]`);
  });
};
