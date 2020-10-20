import { TitleBarWindowStat } from '../@types/titlebar';

export const ipcRenderer = window.BOXHERO_IPC_RENDERER!;
export const getMainView = () => document.querySelector('#main-view');

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
};
