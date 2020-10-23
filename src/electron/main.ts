import { app, session } from 'electron';
import { openBoxHero } from './window';
import { isMac } from './envs';
import { initViewIPC } from './ipc/initViewIPC';
import { initWindowIPC } from './ipc/initWindowIPC';
import { initViewEvents, updateViewState } from './utils/manageViewState';

app.on('ready', () => {
  /* 구글 인증 페이지에서만 요청 헤더 중 userAgent를 크롬으로 변경해 전송한다.
   * 구글 인증이 안되는 문제에 대한 미봉책. */
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['https://accounts.google.com/*'] },
    (details, callback) => {
      details.requestHeaders['User-Agent'] = 'Chrome';
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    }
  );

  initWindowIPC();
  initViewIPC();
  openBoxHero();
});

app.on('browser-window-created', (_, newWindow) => {
  newWindow.webContents.once('did-finish-load', () => {
    updateViewState(newWindow);
    initViewEvents();
  });
});

app.on('browser-window-focus', (_, focusedWindow) => {
  updateViewState(focusedWindow);
  initViewEvents();
});

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

app.on('activate', (_, hasVisibleWindows) => {
  if (!hasVisibleWindows) openBoxHero();
});
