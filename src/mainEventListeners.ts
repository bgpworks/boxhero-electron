import { ipcMain } from 'electron';
import { windows } from './window';

export const initMainIPC = () => {
  const { mainView, mainWindow } = windows;

  const sendCurrentStat = () => {
    if (mainView && mainWindow) {
      mainWindow.webContents.send('reload-stat', {
        canGoBack: mainView.webContents.canGoBack(),
        canGoForward: mainView.webContents.canGoForward(),
      });
    }
  };

  ipcMain.on('go-back', () => {
    if (mainView) {
      mainView.webContents.goBack();
      sendCurrentStat();
    }
  });

  ipcMain.on('refresh', () => {
    if (mainView) {
      mainView.webContents.reload();
    }
  });

  ipcMain.on('go-forward', () => {
    if (mainView) {
      mainView.webContents.goForward();
      sendCurrentStat();
    }
  });

  ipcMain.on('sync-stat', () => {
    sendCurrentStat();
  });
};
