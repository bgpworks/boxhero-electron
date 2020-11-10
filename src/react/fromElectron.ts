import { WebviewTag } from 'electron';
import { TitleBarWindowStat } from '../@types/titlebar';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const ipcRenderer = window.BOXHERO_IPC_RENDERER!;

export const getMainView = () =>
  document.querySelector('#main-view') as WebviewTag;

export const historyMethods = {
  goBack: () => ipcRenderer.invoke('history-go-back'),
  goForward: () => ipcRenderer.invoke('history-go-forward'),
  refresh: () => ipcRenderer.invoke('history-refresh'),
};

export const windowMethods = {
  toggleMaximize: () => ipcRenderer.invoke('window-toggle-maximize'),
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  getWindowStat: (): Promise<TitleBarWindowStat> =>
    ipcRenderer.invoke('get-window-stat'),
};

export const mainMethods = {
  openMainMenu: () => ipcRenderer.invoke('open-main-menu'),
  getAppLocale: (): Promise<string> => ipcRenderer.invoke('get-app-locale'),
};

export const updateMethods = {
  checkUpdate: () => ipcRenderer.invoke('check-for-update'),
  getCurrentVersion: (): Promise<string> =>
    ipcRenderer.invoke('get-current-version'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  cancelDownload: () => ipcRenderer.invoke('cancel-download'),
  quitAndInstall: () => ipcRenderer.invoke('quit-and-install'),
};
