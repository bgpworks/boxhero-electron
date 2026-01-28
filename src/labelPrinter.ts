import { app, BrowserWindow, ipcMain, session } from "electron";
import { spawn, execSync } from "child_process";
import path from "path";
import log from "electron-log";

let labelPrinterProcess: ReturnType<typeof spawn> | null = null;

function getBinaryPath(): string {
  const platform = process.platform;
  const binaryName =
    platform === "win32" ? "label_printer.exe" : "label_printer";

  if (app.isPackaged) {
    return path.join(process.resourcesPath, platform, binaryName);
  }
  return path.join(app.getAppPath(), "resources", "bin", platform, binaryName);
}

export function startLabelPrinter(): Promise<number> {
  const binaryPath = getBinaryPath();

  return new Promise((resolve, reject) => {
    const child = spawn(binaryPath, [], {
      env: { ...process.env, LABEL_PRINTER_PORT: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    });

    labelPrinterProcess = child;

    let stdoutBuffer = "";

    const timer = setTimeout(() => {
      reject(new Error("Timeout waiting for label_printer port"));
    }, 10000);

    child.stdout.on("data", (data: Buffer) => {
      const str = data.toString();
      log.info("[label_printer stdout]", str.trim());
      stdoutBuffer += str;
      const match = stdoutBuffer.match(/LABEL_PRINTER_PORT=(\d+)/);
      if (match) {
        clearTimeout(timer);
        resolve(parseInt(match[1], 10));
      }
    });

    child.stderr.on("data", (data: Buffer) => {
      log.warn("[label_printer stderr]", data.toString());
    });

    child.on("error", (err: Error) => {
      log.error("[label_printer] Failed to start:", err);
      clearTimeout(timer);
      reject(err);
    });

    child.on("exit", (code: number | null, signal: string | null) => {
      log.info(`[label_printer] Exited with code=${code}, signal=${signal}`);
      labelPrinterProcess = null;
      clearTimeout(timer);
      reject(
        new Error(`label_printer exited before providing port (code=${code})`)
      );
    });
  });
}

export function stopLabelPrinter(): void {
  if (!labelPrinterProcess) return;

  const child = labelPrinterProcess;
  labelPrinterProcess = null;

  child.stdout?.removeAllListeners();
  child.stderr?.removeAllListeners();
  child.removeAllListeners();

  if (process.platform === "win32") {
    try {
      execSync(`taskkill /pid ${child.pid} /T /F`);
    } catch (_e) {
      // Process may already be dead
    }
  } else {
    child.kill("SIGTERM");
  }
}

export function registerLabelPrinterIPC(printerPort: number): void {
  ipcMain.handle("label-printer/print", async (_event, pdfBase64: string) => {
    if (!printerPort) throw new Error("label_printer is not running");

    const parentWin = BrowserWindow.fromWebContents(
      _event.sender.hostWebContents ?? _event.sender
    );

    const printWin = new BrowserWindow({
      width: 400,
      height: 600,
      title: "Print",
      autoHideMenuBar: true,
      parent: parentWin || undefined,
      modal: !!parentWin,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "printPreload.js"),
      },
    });

    const closeHandler = (event: Electron.IpcMainEvent) => {
      if (event.sender === printWin.webContents) {
        printWin.close();
        ipcMain.removeListener("close-print-window", closeHandler);
      }
    };
    ipcMain.on("close-print-window", closeHandler);

    printWin.webContents.on("before-input-event", (_event, input) => {
      if (input.key === "Escape") {
        printWin.close();
      }
    });

    printWin.webContents.on("did-finish-load", () => {
      printWin.webContents.send("pdf-data", pdfBase64);
    });

    const cookies = await session.defaultSession.cookies.get({ name: "lang" });
    const locale = cookies[0]?.value ?? app.getLocale();
    printWin.loadURL(`http://127.0.0.1:${printerPort}/print?locale=${locale}`);

    return new Promise<void>((resolve) => {
      printWin.on("closed", () => {
        ipcMain.removeListener("close-print-window", closeHandler);
        resolve();
      });
    });
  });
}
