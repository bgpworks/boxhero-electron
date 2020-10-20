import { BrowserWindow, app } from 'electron';
import debounce from 'lodash.debounce';
import { isMac } from '../envs';
import { menu } from '../menu';
import { setMainIPC, getWindowStat } from './utils';

export const initWindowIPC = (mainWindow: BrowserWindow) => {
  setMainIPC
    .handle('window-minimize', () => mainWindow.minimize())
    .handle('window-maximize', () =>
      mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
    )
    .handle('window-close', () => {
      if (!isMac) {
        app.quit();
      } else {
        mainWindow.close();
      }
    })
    .handle('window-toggle-maximize', () => {
      const { isMaximized, isFullScreen } = getWindowStat(mainWindow);

      if (isFullScreen) {
        mainWindow.setFullScreen(false);
      } else if (isMaximized) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    })
    .handle('get-window-stat', () => {
      const winStat = getWindowStat(mainWindow);

      return winStat;
    })
    .handle('open-main-menu', () => {
      menu.popup({
        x: 20,
        y: 38,
      });
    });

  const syncWindowStat = debounce(() => {
    const winStat = getWindowStat(mainWindow);
    mainWindow.webContents.send('sync-window-stat', winStat);
  }, 300);

  mainWindow.on('resize', syncWindowStat);
};
