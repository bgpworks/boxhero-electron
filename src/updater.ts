import ms from "ms";
import os from "os";
import packageInfo from "../package.json";

import { autoUpdater } from "electron";
import { LogFunctions } from "electron-log";

type UpdateState =
  | "pending"
  | "checking"
  | "error"
  | "available"
  | "not-available"
  | "downloaded";

type UpdaterEvents =
  | "error"
  | "checking-for-update"
  | "update-available"
  | "update-not-available"
  | "update-downloaded"
  | "before-quit-for-update";

class Updater {
  static #instance?: Updater;
  private logger?: LogFunctions;
  private updateInterval: number;
  private intervalID: NodeJS.Timeout | null;
  private stateMappers: Map<UpdaterEvents, () => void> = new Map();

  private state: UpdateState = "pending";

  private constructor() {
    return this;
  }

  static getInstance() {
    if (this.#instance) {
      return this.#instance;
    }

    const updater = new Updater();
    return updater;
  }

  private get userAgent() {
    return `${packageInfo.name}/${
      packageInfo.version
    } (${os.platform()}: ${os.arch()})`;
  }

  public setFeedURL(baseURL: string) {
    switch (true) {
      case process.platform === "darwin":
        autoUpdater.setFeedURL({
          serverType: "json",
          url: `${baseURL}/RELEASES.json`,
          headers: { "User-Agent": this.userAgent },
        });
        break;

      case process.platform === "win32":
        autoUpdater.setFeedURL({
          url: baseURL,
          headers: { "User-Agent": this.userAgent },
        });
        break;
    }

    this.startSyncState();

    return this;
  }

  private mapEventToState(event: UpdaterEvents, state: UpdateState) {
    if (this.stateMappers.has(event)) {
      const prev = this.stateMappers.get(event);
      autoUpdater.off(event, prev);
    }

    const handler = () => {
      this.state = state;
      this.logger.info(state);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    autoUpdater.addListener(event as any, handler);
    this.stateMappers.set(event, handler);

    return this;
  }

  private startSyncState() {
    this.state = "pending";

    this.mapEventToState("error", "error")
      .mapEventToState("checking-for-update", "checking")
      .mapEventToState("update-available", "available")
      .mapEventToState("update-not-available", "not-available")
      .mapEventToState("update-downloaded", "downloaded");

    return this;
  }

  public watch(updateInterval = "10 minutes") {
    this.stopWatch();

    this.updateInterval = ms(updateInterval);

    this.checkForUpdates();

    this.intervalID = setInterval(() => {
      this.checkForUpdates();
    }, this.updateInterval);

    return this;
  }

  public stopWatch() {
    clearInterval(this.intervalID);
    this.intervalID = null;

    return this;
  }

  public setLogger(logger: LogFunctions): Updater {
    this.logger = logger;
    return this;
  }

  public checkForUpdates() {
    if (this.state !== "checking") {
      autoUpdater.checkForUpdates();
    }

    return this;
  }

  public quitAndInstall() {
    if (this.state === "downloaded") {
      autoUpdater.quitAndInstall();
    }

    return this;
  }
}

export default Updater;
