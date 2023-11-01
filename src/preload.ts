/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from "electron";

const api: electronAPI = {
  platform: process.platform,
  navigation: {
    goBack: () => ipcRenderer.invoke("history/go-back"),
    goForward: () => ipcRenderer.invoke("history/go-forward"),
    reload: () => ipcRenderer.invoke("history/reload"),
    onSyncNav: (callback: any) => ipcRenderer.on("sync/nav-stat", callback),
    offSyncNav: (callback: any) => ipcRenderer.off("sync/nav-stat", callback),
  },
  window: {
    toggleMaximize: () => ipcRenderer.invoke("window/toggle-maximize"),
    minimize: () => ipcRenderer.invoke("window/minimize"),
    maximize: () => ipcRenderer.invoke("window/maximize"),
    close: () => ipcRenderer.invoke("window/close"),
    getWindowStat: () => ipcRenderer.invoke("window/get-stat"),
    onSyncWindowStat: (callback: any) =>
      ipcRenderer.on("sync/window-stat", callback),
    offSyncWindowStat: (callback: any) =>
      ipcRenderer.off("sync/window-stat", callback),
  },
  loading: {
    onSyncLoading: (callback: any) => ipcRenderer.on("sync/loading", callback),
    offSyncLoading: (callback: any) =>
      ipcRenderer.off("sync/loading", callback),
  },
  app: {
    openMainMenu: () => ipcRenderer.invoke("app/open-main-menu"),
    openExternal: (url: string) =>
      ipcRenderer.invoke("app/open-external-link", url),
    getLocale: (): Promise<string> => ipcRenderer.invoke("app/get-app-locale"),
  },
};

contextBridge.exposeInMainWorld("electronAPI", api);
