import { contextBridge, ipcRenderer } from "electron";

const pdfDataPromise = new Promise<string>((resolve) => {
  ipcRenderer.on("pdf-data", (_event, data: string) => resolve(data));
});

contextBridge.exposeInMainWorld("labelPrinter", {
  getPdfData: () => pdfDataPromise,
  closeWindow: () => ipcRenderer.send("close-print-window"),
});
