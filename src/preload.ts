import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  ipcRenderer: ipcRenderer,
  platform: process.platform,
});
