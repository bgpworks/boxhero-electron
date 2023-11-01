import { app } from "electron";
import log from "electron-log";

import { AWS_BUCKET, AWS_DEFAULT_REGION, isBeta } from "../envs";
import Updater from "../updater";

function initUpdater() {
  if (!app.isPackaged) return;

  const prefix = isBeta ? `${process.platform}-beta` : `${process.platform}`;

  Updater.getInstance()
    .setLogger(log)
    .setFeedURL(
      `https://${AWS_BUCKET}.s3.${AWS_DEFAULT_REGION}.amazonaws.com/${prefix}`
    )
    .initAlarm()
    .watch();
}

export default initUpdater;
