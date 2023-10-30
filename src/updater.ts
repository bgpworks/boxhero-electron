import ms from "ms";
import os from "os";
import packageInfo from "../package.json";

import { autoUpdater, dialog } from "electron";
import { LogFunctions } from "electron-log";
import i18n from "./i18next";

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
  private lastReleaseName?: string;

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

    this.logger?.info(`feedURL: ${autoUpdater.getFeedURL()}`);
    this.logger?.info(`userAgent: ${this.userAgent}`);

    this.startSyncState();

    return this;
  }

  private mapEventToState(event: UpdaterEvents, state: UpdateState) {
    if (this.stateMappers.has(event)) {
      const prev = this.stateMappers.get(event);
      autoUpdater.off(event, prev);
    }

    const handler = (...args: unknown[]) => {
      this.logger.info(`Update state changed. ${this.state} -> ${state}`);
      this.state = state;

      if (state === "error") {
        this.logger.error(...args);
      }
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

  public watch(updateInterval = "5 minutes") {
    this.stopWatch();

    this.updateInterval = ms(updateInterval);

    this.checkForUpdates();

    this.intervalID = setInterval(() => {
      this.checkForUpdates();
    }, this.updateInterval);

    this.logger?.info("Started watching for updates...");

    return this;
  }

  public stopWatch() {
    clearInterval(this.intervalID);
    this.intervalID = null;

    this.logger?.info("Stopped watching for updates.");

    return this;
  }

  public setLogger(logger: LogFunctions): Updater {
    this.logger = logger;
    return this;
  }

  public checkForUpdates() {
    switch (this.state) {
      case "downloaded":
        this.logger?.info(
          `The update has already been downloaded(${this.lastReleaseName}). Displaying the update notification window.`
        );
        this.openUpdateAlarm(this.lastReleaseName);
        break;
      case "checking":
      case "available":
        break;
    }

    autoUpdater.checkForUpdates();

    return this;
  }

  public quitAndInstall() {
    if (this.state === "downloaded") {
      autoUpdater.quitAndInstall();
    }

    return this;
  }

  public initAlarm() {
    autoUpdater.on(
      "update-downloaded",
      (event, releaseNotes, releaseName, releaseDate, updateURL) => {
        this.logger?.info("An update has been downloaded.", [
          event,
          releaseNotes,
          releaseName,
          releaseDate,
          updateURL,
        ]);

        this.lastReleaseName = releaseName;

        this.openUpdateAlarm(releaseName);
      }
    );

    return this;
  }

  private async openUpdateAlarm(releaseName: string) {
    const { response } = await dialog.showMessageBox({
      type: "info",
      buttons: [i18n.t("updater:btn-restart"), i18n.t("updater:btn-later")],
      title: i18n.t("updater:title"),
      message: releaseName,
      detail: i18n.t("updater:description"),
    });

    if (response === 1) return;

    this.quitAndInstall();
  }
}

export default Updater;
