import { ipcMain, BrowserWindow, webContents, WebContents } from 'electron';
import { TitleBarNavStat, TitleBarWindowStat } from '../../@types/titlebar';
import { OnlyParam } from '../../@types/utils';

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
