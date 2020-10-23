import { ipcMain, BrowserWindow, webContents, WebContents } from 'electron';
import debounce from 'lodash.debounce';
import { TitleBarNavStat, TitleBarWindowStat } from '../../@types/titlebar';
import { OnlyParam } from '../../@types/utils';
import i18n from '../i18next';
import { getContextMenu } from '../menu';

interface ISetMainIPC {
  handle: OnlyParam<typeof ipcMain.handle, ISetMainIPC>;
}

/*
ipc 관련 메서드를 더 간단하게 다루기 위한 래퍼.

- handle 메서드에서 기본적으로 지원되지 않는 메서드 체이닝을 지원.
- 핸들러의 중복 등록을 예방.
*/
export const setMainIPC: ISetMainIPC = {
  handle: (channel, listener) => {
    ipcMain.removeHandler(channel);
    ipcMain.handle(channel, listener);

    return setMainIPC;
  },
};

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

export const getNavStat = (webContents: WebContents): TitleBarNavStat => {
  const canGoBack = webContents.canGoBack();
  const canGoForward = webContents.canGoForward();

  return {
    canGoBack,
    canGoForward,
  };
};

export const getWindowStat = (window: BrowserWindow): TitleBarWindowStat => {
  const isMaximized = window.isMaximized();
  const isFullScreen = window.isFullScreen();

  return {
    isMaximized,
    isFullScreen,
  };
};

interface ICurrentContents {
  focusedWindow?: BrowserWindow;
  wrapperContents?: WebContents;
  targetContents?: WebContents;
}

export const currentContents: ICurrentContents = {};

export const resetCurrentContents = (window: BrowserWindow) => {
  const wrapperContents = window.webContents;
  const childViewContents = getChildWebView(window);
  const targetContents = childViewContents || wrapperContents;

  currentContents.focusedWindow = window;
  currentContents.wrapperContents = wrapperContents;
  currentContents.targetContents = targetContents;

  initWindowEvent(window);
  initNavEvent(targetContents);
  initContextEvent(targetContents);
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

export const getCurrentViews = (): ICurrentContents => {
  const { wrapperContents, targetContents, focusedWindow } = currentContents;
  return { wrapperContents, targetContents, focusedWindow };
};

export const syncNavStat = () => {
  const { wrapperContents, targetContents } = currentContents;

  if (!wrapperContents || !targetContents) return;

  const navStat = getNavStat(targetContents);
  wrapperContents.send('sync-nav-stat', navStat);
};

export const syncWindowStat = debounce(() => {
  const { focusedWindow } = getCurrentViews();

  if (!focusedWindow) return;

  const winStat = getWindowStat(focusedWindow);
  focusedWindow.webContents.send('sync-window-stat', winStat);
}, 300);

export const navGoBack = () => {
  const { targetContents } = getCurrentViews();
  targetContents && targetContents.goBack();
};

export const navGoForward = () => {
  const { targetContents } = getCurrentViews();
  targetContents && targetContents.goForward();
};

export const navReload = () => {
  const { targetContents } = getCurrentViews();
  if (!targetContents) return;

  targetContents.reload();
};
