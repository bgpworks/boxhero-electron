import path from 'path';
import { app, BrowserWindowConstructorOptions, BrowserWindow } from 'electron';
import { isWindow } from './envs';
import { getWindowState, persistWindowState } from './utils/persistWindowState';
import { getViewState } from './utils/manageViewState';

const mainWindows: BrowserWindow[] = [];

export const openBoxHero = () => {
  const prevWindowState = getWindowState({
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 1200,
      height: 800,
    },
  });

  const newWindow = createMainWindow({
    ...prevWindowState.size,
    ...(mainWindows.length > 0 ? getNextPosition() : prevWindowState.position),
    minWidth: 1000,
    minHeight: 562,
    title: 'BoxHero',
    webPreferences: {
      devTools: true,
      webviewTag: true,
      preload: path.resolve(
        app.getAppPath(),
        './out/electron/preloads/wrapper-preload.js'
      ),
    },
    backgroundColor: '#282c42',
    ...(isWindow ? { frame: false } : { titleBarStyle: 'hiddenInset' }),
  });

  newWindow.webContents.once('did-finish-load', () => {
    persistWindowState(newWindow);
  });
};

let aboutWindow: BrowserWindow | null;

export const openAboutPage = () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();

  if (aboutWindow) return;

  let additionalProps: BrowserWindowConstructorOptions = {};

  if (focusedWindow) {
    const {
      x: parentX,
      y: parentY,
      width: parentWidth,
      height: parentHeight,
    } = focusedWindow.getBounds();

    additionalProps = {
      x: (parentX + parentWidth * 0.5 - 145) >> 0,
      y: (parentY + parentHeight * 0.3 - 75) >> 0,
      parent: focusedWindow,
    };
  }

  const newAboutWindow = new BrowserWindow({
    // 부모 윈도우 기준으로 가운데 정렬 & 상단으로부터 30% 위치에 about window를 띄운다.
    // 열려있는 창이 없을 때는 부모 윈도 및 위치 설정 안하고 그냥 띄움
    ...additionalProps,
    width: 290,
    height: 195,
    alwaysOnTop: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  newAboutWindow.loadFile(path.resolve(app.getAppPath(), './out/about.html'));

  newAboutWindow.webContents.once('did-finish-load', () => {
    aboutWindow = newAboutWindow;
    newAboutWindow.show();
  });

  newAboutWindow.once('close', () => {
    aboutWindow = null;
  });
};

const getNextPosition = () => {
  const { focusedWindow } = getViewState();

  if (!focusedWindow) return {};
  const { x, y } = focusedWindow.getBounds();

  return { x: x + 50, y: y + 50 };
};

export const createMainWindow = (extOpts?: BrowserWindowConstructorOptions) => {
  const currentWindow = new BrowserWindow({
    ...(extOpts ? extOpts : {}),
  });

  currentWindow.loadFile(path.resolve(app.getAppPath(), './out/index.html'));

  currentWindow.once('ready-to-show', () => {
    currentWindow.show();
    addToWindowGroup(currentWindow, mainWindows);
  });

  return currentWindow;
};

const addToWindowGroup = (
  targetWindow: BrowserWindow,
  windowGroup: BrowserWindow[]
) => {
  windowGroup.push(targetWindow);

  targetWindow.once('close', () => {
    const findedIndex = windowGroup.findIndex(
      (window) => window === targetWindow
    );
    windowGroup.splice(findedIndex, 1);
  });
};
