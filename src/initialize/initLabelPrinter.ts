import log from "electron-log";

import { startLabelPrinter, registerLabelPrinterIPC } from "../labelPrinter";

const initLabelPrinter = async () => {
  let port: number | null = null;
  try {
    port = await startLabelPrinter();
    log.info("[main] label_printer started successfully on port", port);
  } catch (err) {
    log.error("[main] Failed to start label_printer:", err);
  }
  registerLabelPrinterIPC(port);
};

export default initLabelPrinter;
