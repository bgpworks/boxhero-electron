import path from 'path';
import { app, session } from 'electron';
import logger from 'electron-log';
import { isMainWindow, openBoxHero } from './window';
import { isDev, isMac } from './envs';
import { initViewIPC } from './ipc/initViewIPC';
import { initWindowIPC } from './ipc/initWindowIPC';
import { initViewEvents, updateViewState } from './utils/manageViewState';
import { initLocale } from './initLocale';
import { initUpdateIPC } from './ipc/initUpdateIPC';

/* log를 file로 저장하도록 설정.
 * unhandled error도 catch 한다.
 */
logger.catchErrors();

// 로그 위치 관련
// 로그 위치를 BoxHero로 고정함.
logger.transports.file.resolvePath = (variables) => {
  if (!variables.fileName)
    return path.resolve(variables.libraryDefaultDir, `../BoxHero/unknown.log`);

  return path.resolve(
    variables.libraryDefaultDir,
    `../BoxHero/${variables.fileName}`
  );
};

logger.log('App starting..');

app.on('ready', () => {
  /* 구글 인증 페이지에서만 요청 헤더 중 userAgent를 크롬으로 변경해 전송한다.
   * 구글 인증이 안되는 문제에 대한 미봉책.
   * 해결책 링크 : https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
   * */
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['https://accounts.google.com/*'] },
    (details, callback) => {
      details.requestHeaders['User-Agent'] = 'Chrome';
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    }
  );

  const appVersion = app.getVersion();

  initLocale();
  initWindowIPC();
  initViewIPC();
  initUpdateIPC(appVersion);

  openBoxHero();
  app.setName('BoxHero');
});

app.on('browser-window-created', (_, newWindow) => {
  newWindow.webContents.once('did-finish-load', () => {
    if (isMainWindow(newWindow)) {
      updateViewState(newWindow);
      initViewEvents();
    }
  });
});

app.on('browser-window-focus', (_, focusedWindow) => {
  if (isMainWindow(focusedWindow)) {
    updateViewState(focusedWindow);
  }
});

app.on('window-all-closed', () => {
  if (!isMac) app.quit();

  if (isDev) {
    logger.log('모든 윈도우가 닫힘');
  }
});

app.on('activate', (_, hasVisibleWindows) => {
  if (!hasVisibleWindows) openBoxHero();
});
