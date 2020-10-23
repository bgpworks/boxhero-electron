import { app } from 'electron';
import { TitleBarWindowStat } from '../../@types/titlebar';
import { isMac } from '../envs';
import i18n from '../i18next';
import { getViewState } from '../utils/manageViewState';
import { setMainIPC, getWindowStat } from './utils';

export const initWindowIPC = () => {
  setMainIPC
    .handle('window-minimize', () => {
      const { focusedWindow } = getViewState();
      focusedWindow && focusedWindow.minimize();
    })
    .handle('window-maximize', () => {
      const { focusedWindow } = getViewState();

      if (!focusedWindow) return;

      focusedWindow.isMaximized()
        ? focusedWindow.unmaximize()
        : focusedWindow.maximize();
    })
    .handle('window-close', () => {
      if (!isMac) {
        app.quit();
      } else {
        const { focusedWindow } = getViewState();
        focusedWindow && focusedWindow.close();
      }
    })
    .handle('window-toggle-maximize', () => {
      const { focusedWindow } = getViewState();

      if (!focusedWindow) return;

      const { isMaximized, isFullScreen } = getWindowStat(focusedWindow);

      if (isFullScreen) {
        focusedWindow.setFullScreen(false);
      } else if (isMaximized) {
        focusedWindow.unmaximize();
      } else {
        focusedWindow.maximize();
      }
    })
    .handle('get-window-stat', () => {
      const { focusedWindow } = getViewState();
      const winStat = focusedWindow
        ? getWindowStat(focusedWindow)
        : defaultWinStat;

      return winStat;
    })
    .handle('change-language', (_, lng: string) => {
      i18n.changeLanguage(lng);
    });
};

const defaultWinStat: TitleBarWindowStat = {
  isFullScreen: false,
  isMaximized: false,
};
