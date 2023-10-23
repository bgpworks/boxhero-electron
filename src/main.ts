import { app, session } from "electron";
import logger from "electron-log";
import { isMainWindow, openBoxHero } from "./window";
import { isMac } from "./envs";
import { initViewIPC } from "./ipc/initViewIPC";
import { initWindowIPC } from "./ipc/initWindowIPC";
import { initViewEvents, updateViewState } from "./utils/manageViewState";
import { initLocale } from "./initLocale";
import { updateElectronApp } from "update-electron-app";

// unhandled error도 catch 한다.
logger.catchErrors();
logger.transports.file.level = "info";

logger.log("App starting..");

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

  openBoxHero();
});

app.on("browser-window-created", (_, newWindow) => {
  newWindow.webContents.once("did-finish-load", () => {
    if (isMainWindow(newWindow)) {
      updateViewState(newWindow);
      initViewEvents();
    }
  });
});

app.on("browser-window-focus", (_, focusedWindow) => {
  if (isMainWindow(focusedWindow)) {
    updateViewState(focusedWindow);
  }
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();

  logger.debug("all window closed");
});

app.on("activate", (_, hasVisibleWindows) => {
  if (!hasVisibleWindows) openBoxHero();
});

updateElectronApp({ logger, updateInterval: "30 minutes" });
