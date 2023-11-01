import { app } from "electron";
import log from "electron-log";
import electronSquirrelStartup from "electron-squirrel-startup";

import { isMac } from "./envs";
import initialize from "./initialize";
import { BoxHeroWindow, windowManager } from "./window";

function main() {
  log.initialize();
  log.errorHandler.startCatching();
  log.transports.file.level = "info";

  log.info("App starting..");

  app.on("ready", async () => {
    await initialize();
    windowManager.open(BoxHeroWindow);
  });

  app.on("window-all-closed", () => {
    log.debug("all window closed");

    if (isMac) return;

    app.quit();
  });

  app.on("activate", (_, hasVisibleWindows) => {
    if (hasVisibleWindows) return;

    windowManager.open(BoxHeroWindow);
  });
}

// NOTE: https://github.com/mongodb-js/electron-squirrel-startup
if (!electronSquirrelStartup) {
  main();
}
