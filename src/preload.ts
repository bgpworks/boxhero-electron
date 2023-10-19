/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  ipcRenderer: ipcRenderer,
  platform: process.platform,
  history: {
    goBack: () => ipcRenderer.invoke("history-go-back"),
    goForward: () => ipcRenderer.invoke("history-go-forward"),
    refresh: () => () => ipcRenderer.invoke("history-refresh"),
    onSyncNav: (callback: any) => ipcRenderer.on("sync-nav-stat", callback),
    offSyncNav: (callback: any) => ipcRenderer.off("sync-nav-stat", callback),
  },
  window: {
    toggleMaximize: () => ipcRenderer.invoke("window-toggle-maximize"),
    minimize: () => ipcRenderer.invoke("window-minimize"),
    maximize: () => ipcRenderer.invoke("window-maximize"),
    close: () => ipcRenderer.invoke("window-close"),
    getWindowStat: () => ipcRenderer.invoke("get-window-stat"),
    onSyncWindowStat: (callback: any) =>
      ipcRenderer.on("sync-window-stat", callback),
    offSyncWindowStat: (callback: any) =>
      ipcRenderer.off("sync-window-stat", callback),
  },
  main: {
    openMainMenu: () => ipcRenderer.invoke("open-main-menu"),
    openExternal: (url: string) =>
      ipcRenderer.invoke("open-external-link", url),
    getAppLocale: (): Promise<string> => ipcRenderer.invoke("get-app-locale"),
  },
});
