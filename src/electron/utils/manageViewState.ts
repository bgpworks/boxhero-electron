import { BrowserWindow, webContents, WebContents } from 'electron';
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
