import i18n from '../i18next';
import { getMainMenu } from '../menu';
import {
  getCurrentViews,
  navGoBack,
  navGoForward,
  navReload,
  setMainIPC,
  syncNavStat,
} from './utils';

export const initViewIPC = () => {
  setMainIPC
    .handle('history-go-back', () => {
      navGoBack();
      syncNavStat();
    })
    .handle('history-go-forward', () => {
      navGoForward();
      syncNavStat();
    })
    .handle('history-refresh', () => {
      navReload();
      syncNavStat();
    })
    .handle('open-main-menu', () => {
      const { wrapperContents } = getCurrentViews();
      if (!wrapperContents) return;

      getMainMenu(i18n).popup({
        x: 20,
        y: 38,
      });
    });
};
