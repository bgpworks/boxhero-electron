import { ipcMain } from "electron";

import { startLabelPrinter, waitForPort } from "../labelPrinter";

export default function initLabelPrinter(): void {
  ipcMain.handle("label-printer/get-port", () => waitForPort());

  startLabelPrinter();
}
