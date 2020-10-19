import { BrowserWindow, ipcMain } from 'electron';

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
    .on('close', () => mainWindow.close());
};
