import { IpcRenderer } from "electron";

export declare global {
  interface Window {
    electronAPI: {
      ipcRenderer: IpcRenderer;
      platform: typeof process.platform;
    };
  }
}
