import { ipcMain, BrowserWindow, WebContents } from 'electron';
import debounce from 'lodash.debounce';
import { TitleBarNavStat, TitleBarWindowStat } from '../../@types/titlebar';
import { OnlyParam } from '../../@types/utils';
import { getViewState } from '../utils/manageViewState';

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

export const syncNavStat = () => {
  const { wrapperContents, targetContents } = getViewState();

  if (!wrapperContents || !targetContents) return;

  const navStat = getNavStat(targetContents);
  wrapperContents.send('sync-nav-stat', navStat);
};

export const syncWindowStat = debounce(() => {
  const { focusedWindow } = getViewState();

  if (!focusedWindow) return;

  const winStat = getWindowStat(focusedWindow);
  focusedWindow.webContents.send('sync-window-stat', winStat);
}, 300);

export const navGoBack = () => {
  const { targetContents } = getViewState();
  targetContents && targetContents.goBack();
};

export const navGoForward = () => {
  const { targetContents } = getViewState();
  targetContents && targetContents.goForward();
};

export const navReload = () => {
  const { targetContents } = getViewState();
  if (!targetContents) return;

  targetContents.reload();
};
