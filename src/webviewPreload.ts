import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("labelPrinter", {
  print: (pdfBase64: string) =>
    ipcRenderer.invoke("label-printer/print", pdfBase64),
});
