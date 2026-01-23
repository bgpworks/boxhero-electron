import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("labelPrinter", {
  getPort: (): Promise<number | null> =>
    ipcRenderer.invoke("label-printer/get-port"),
});
