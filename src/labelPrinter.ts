import { app } from "electron";
import log from "electron-log";
import { spawn, ChildProcess } from "child_process";
import path from "path";

import { isDev, isWindow } from "./envs";

const BINARY_NAME = isWindow ? "label_printer.exe" : "label_printer";

function getBinaryPath(): string {
  const platform = process.platform;

  if (isDev) {
    return path.join(
      app.getAppPath(),
      "resources",
      "bin",
      platform,
      BINARY_NAME
    );
  }

  return path.join(process.resourcesPath, platform, BINARY_NAME);
}

let childProcess: ChildProcess | null = null;
let portReadyPromise: Promise<number | null> | null = null;

export function waitForPort(): Promise<number | null> {
  return portReadyPromise ?? Promise.resolve(null);
}

export function startLabelPrinter(): void {
  const binaryPath = getBinaryPath();
  log.info(`Starting LabelPrinter: ${binaryPath}`);

  portReadyPromise = new Promise<number | null>((resolve) => {
    try {
      childProcess = spawn(binaryPath, [], {
        stdio: "pipe",
        detached: false,
        env: { ...process.env, LABEL_PRINTER_PORT: "0" },
      });

      childProcess.stdout?.on("data", (data: Buffer) => {
        const output = data.toString().trim();
        log.info(`[LabelPrinter] ${output}`);

        const match = output.match(/LABEL_PRINTER_PORT=(\d+)/);
        if (match) {
          const port = parseInt(match[1], 10);
          log.info(`[LabelPrinter] Listening on port ${port}`);
          resolve(port);
        }
      });

      childProcess.stderr?.on("data", (data: Buffer) => {
        log.warn(`[LabelPrinter] ${data.toString().trim()}`);
      });

      childProcess.on("error", (err) => {
        log.error(`[LabelPrinter] Failed to start: ${err.message}`);
        childProcess = null;
        resolve(null);
      });

      childProcess.on("exit", (code, signal) => {
        log.info(`[LabelPrinter] Exited with code=${code}, signal=${signal}`);
        childProcess = null;
        resolve(null);
      });
    } catch (err) {
      log.error(`[LabelPrinter] Spawn error: ${err}`);
      resolve(null);
    }
  });
}

export function stopLabelPrinter(): void {
  if (childProcess == null) return;

  log.info("[LabelPrinter] Stopping process...");

  try {
    if (isWindow) {
      spawn("taskkill", ["/pid", String(childProcess.pid), "/f", "/t"]);
    } else {
      childProcess.kill("SIGTERM");
    }
  } catch (err) {
    log.error(`[LabelPrinter] Failed to stop: ${err}`);
  }

  childProcess = null;
  portReadyPromise = null;
}
