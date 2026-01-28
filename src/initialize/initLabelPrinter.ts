import log from "electron-log";

import {
  startLabelPrinter,
  registerLabelPrinterIPC,
} from "../labelPrinter";

const initLabelPrinter = async () => {
  try {
    const port = await startLabelPrinter();
    log.info("[main] label_printer started successfully on port", port);
    registerLabelPrinterIPC(port);
  } catch (err) {
    log.error("[main] Failed to start label_printer:", err);
  }
};

export default initLabelPrinter;
