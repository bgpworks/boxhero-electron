import path from 'path';
import { app, BrowserWindow, webContents, WebContents } from 'electron';
import i18n from '../i18next';
import { syncNavStat, syncWindowStat } from '../ipc/utils';
import { getContextMenu } from '../menu';

/*
해당 윈도우에 붙어있는 웹뷰를 추출한다.
반드시 부모 webContents가 로드가 끝난 후 사용할 것.
*/
export const getChildWebView = (parentWindow: BrowserWindow) => {
  const childView = webContents
    .getAllWebContents()
    .find(
      (wc) =>
        wc.getType() === 'webview' &&
        wc.hostWebContents === parentWindow.webContents
    );

  return childView;
};

interface ICurrentViewState {
  focusedWindow?: BrowserWindow;
  wrapperContents?: WebContents;
  targetContents?: WebContents;
}

const currentViewState: ICurrentViewState = {};

export const updateViewState = (window: BrowserWindow) => {
  const wrapperContents = window.webContents;
  const childViewContents = getChildWebView(window);
  const targetContents = childViewContents || wrapperContents;

  currentViewState.focusedWindow = window;
  currentViewState.wrapperContents = wrapperContents;
  currentViewState.targetContents = targetContents;
};

export const getViewState = (): ICurrentViewState => {
  const { wrapperContents, targetContents, focusedWindow } = currentViewState;
  return { wrapperContents, targetContents, focusedWindow };
};

export const initViewEvents = () => {
  const { focusedWindow, targetContents } = getViewState();

  if (!focusedWindow || !targetContents) return;

  initWindowEvent(focusedWindow);
  initNavEvent(targetContents);
  initContextEvent(targetContents);

  errorHandle(targetContents);
};

const errorHandle = (targetContents: WebContents) => {
  targetContents.once('did-fail-load', (_, errorCode) => {
    targetContents.clearHistory();
    switch (errorCode) {
      case -3:
        /* 리다이렉트 응답시 발생되는 에러코드, 무시 가능하다.
        참고 : https://tinydew4.github.io/electron-ko/docs/api/web-contents/#event-did-fail-load*/
        break;
      case -106:
        targetContents.loadFile(
          path.resolve(app.getAppPath(), './static/connection-error.html')
        );
        break;
      default:
        targetContents.loadFile(
          path.resolve(app.getAppPath(), './static/404.html')
        );
    }
  });
};

const initNavEvent = (targetContents: WebContents) => {
  targetContents.off('did-navigate', syncNavStat);
  targetContents.off('did-navigate-in-page', syncNavStat);

  targetContents
    .on('did-navigate', syncNavStat)
    .on('did-navigate-in-page', syncNavStat);
};

const initWindowEvent = (targetWindow: BrowserWindow) => {
  targetWindow.off('resize', syncWindowStat);
  targetWindow.on('resize', syncWindowStat);
};

const initContextEvent = (targetContents: WebContents) => {
  targetContents.removeAllListeners('context-menu');
  targetContents.on('context-menu', (_, { x, y }) => {
    getContextMenu(i18n).popup({
      x,
      y,
    });
  });
};
