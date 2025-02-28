import { app } from "electron";
import log from "electron-log";

import { FEED_BASE_URL, isBeta } from "../envs";
import Updater from "../updater";

function initUpdater() {
  if (!app.isPackaged) return;

  const prefix = isBeta ? `${process.platform}-beta` : `${process.platform}`;

  Updater.getInstance()
    .setLogger(log)
    .setFeedURL(`${FEED_BASE_URL}/${prefix}`)
    .initAlarm()
    .watch();
}

export default initUpdater;
