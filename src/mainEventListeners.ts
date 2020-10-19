import { BrowserView, BrowserWindow, ipcMain } from 'electron';

interface initMainIPCProps {
  mainView: BrowserView;
  mainWindow: BrowserWindow;
}

export const initMainIPC = ({ mainView, mainWindow }: initMainIPCProps) => {
  const emitSyncNavigation = () => {
    mainWindow.webContents.send('sync-navigation', {
      canGoBack: mainView.webContents.canGoBack(),
      canGoForward: mainView.webContents.canGoForward(),
    });
  };

  mainView.webContents
    .on('did-navigate', emitSyncNavigation)
    .on('did-navigate-in-page', emitSyncNavigation);

  ipcMain
    .on('go-back', () => {
      mainView.webContents.goBack();
      emitSyncNavigation();
    })
    .on('go-forward', () => {
      mainView.webContents.goForward();
      emitSyncNavigation();
    })
    .on('refresh', () => {
      mainView.webContents.reload();
    });
};
