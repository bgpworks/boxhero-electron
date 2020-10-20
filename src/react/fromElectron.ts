export const ipcRenderer = window.BOXHERO_IPC_RENDERER!;
export const getMainView = () => document.querySelector('#main-view');

export const viewNavigationMethods = {
  goBack: () => ipcRenderer.invoke('history-go-back'),
  goForward: () => ipcRenderer.invoke('history-go-forward'),
  refresh: () => ipcRenderer.invoke('history-refresh'),
  toggleMaximize: () => ipcRenderer.invoke('window-toggle-maximize'),
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  openMainMenu: () => ipcRenderer.invoke('open-main-menu'),
};
