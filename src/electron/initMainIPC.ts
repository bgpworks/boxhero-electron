import { BrowserWindow, ipcMain } from 'electron';
import { menu } from './menu';

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
    .on('close', () => mainWindow.close())
    .on('open-main-menu', () => {
      menu.popup({
        x: 20,
        y: 38,
      });
    });
};
