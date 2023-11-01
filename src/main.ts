import { app, session } from "electron";
import log from "electron-log";
import electronSquirrelStartup from "electron-squirrel-startup";

import { AWS_BUCKET, AWS_DEFAULT_REGION, isBeta, isMac } from "./envs";
import { initLocale } from "./initialize/initLocale";
import { initViewIPC } from "./initialize/initViewIPC";
import { initWindowIPC } from "./initialize/initWindowIPC";
import Updater from "./updater";
import { BoxHeroWindow, windowManager } from "./window";

function main() {
  log.initialize();
  log.errorHandler.startCatching();
  log.transports.file.level = "info";

  log.info("App starting..");

  app.on("ready", async () => {
    /* 구글 인증 페이지에서만 요청 헤더 중 userAgent를 변경해 전송한다.
     * 구글 인증이 안되는 문제에 대한 미봉책.
     * 해결책 링크 : https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
     * */
    session.defaultSession.webRequest.onBeforeSendHeaders(
      { urls: ["https://accounts.google.com/*"] },
      (details, callback) => {
        const userAgentBefore = details.requestHeaders["User-Agent"];
        details.requestHeaders["User-Agent"] = userAgentBefore.replace(
          /Electron\/.*/,
          ""
        );
        callback({ cancel: false, requestHeaders: details.requestHeaders });
      }
    );

    await initLocale();
    initWindowIPC();
    initViewIPC();

    windowManager.open(BoxHeroWindow);

    if (!app.isPackaged) return;

    // The code below will only run in production.

    const prefix = isBeta ? `${process.platform}-beta` : `${process.platform}`;

    Updater.getInstance()
      .setLogger(log)
      .setFeedURL(
        `https://${AWS_BUCKET}.s3.${AWS_DEFAULT_REGION}.amazonaws.com/${prefix}`
      )
      .initAlarm()
      .watch();
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

// @ts-ignore
// NOTE: https://github.com/mongodb-js/electron-squirrel-startup
if (!electronSquirrelStartup) {
  main();
}
