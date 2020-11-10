import path from 'path';
import { app, BrowserWindowConstructorOptions, BrowserWindow } from 'electron';
import { isWindow, isDev } from './envs';
import { getWindowState, persistWindowState } from './utils/persistWindowState';
import { getViewState, setUpdateWindow } from './utils/manageViewState';
import log from 'electron-log';

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

  const { mainWindows } = getViewState();

  const newWindow = createMainWindow({
    ...prevWindowState.size,
    ...(mainWindows.length > 0 ? getNextPosition() : prevWindowState.position),
    minWidth: 1000,
    minHeight: 562,
    title: 'BoxHero',
    webPreferences: {
      devTools: isDev,
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

  log.log(
    `새로운 박스히어로 윈도우 오픈 [현재 ${mainWindows.length}개 열려있음]`
  );
};

export const openUpdatePage = () => {
  const { updateWindow } = getViewState();
  if (updateWindow) return;

  const newUpdateWindow = new BrowserWindow({
    width: 320,
    height: 240,
    alwaysOnTop: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(
        app.getAppPath(),
        './out/electron/preloads/wrapper-preload.js'
      ),
    },
  });

  newUpdateWindow.setMenuBarVisibility(false);
  newUpdateWindow.loadFile(path.resolve(app.getAppPath(), './out/update.html'));

  newUpdateWindow.webContents.once('did-finish-load', () => {
    newUpdateWindow.show();
  });

  newUpdateWindow
    .once('show', () => {
      setUpdateWindow(newUpdateWindow);
      if (isDev) {
        log.log('update 윈도우 열림');
      }
    })
    .once('close', () => {
      setUpdateWindow();
      if (isDev) {
        log.log('update 윈도우 닫힘');
      }
    });
};

let aboutWindow: BrowserWindow | null;

export const openAboutPage = () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();

  if (aboutWindow) return;

  let additionalProps: BrowserWindowConstructorOptions = {};

  if (focusedWindow && isMainWindow(focusedWindow)) {
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
    height: isWindow ? 250 : 220,
    alwaysOnTop: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  newAboutWindow.setMenuBarVisibility(false);
  newAboutWindow.loadFile(path.resolve(app.getAppPath(), './out/about.html'));

  newAboutWindow.webContents.once('did-finish-load', () => {
    aboutWindow = newAboutWindow;
    newAboutWindow.show();

    if (isDev) {
      log.log('about 윈도우 열림');
    }
  });

  newAboutWindow.once('close', () => {
    aboutWindow = null;
    log.log('about 윈도우 닫힘');
  });
};

const getNextPosition = () => {
  const { focusedWindow } = getViewState();

  if (!focusedWindow || !isMainWindow(focusedWindow)) return {};

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
  });

  addToMainWindowGroup(currentWindow);
  return currentWindow;
};

const addToMainWindowGroup = (targetWindow: BrowserWindow) => {
  const { mainWindows } = getViewState();

  mainWindows.push(targetWindow);

  targetWindow.once('close', () => {
    const findedIndex = mainWindows.findIndex(
      (window) => window === targetWindow
    );

    mainWindows.splice(findedIndex, 1);

    if (isDev) {
      log.log(`박스히어로 윈도우 닫힘 [현재 ${mainWindows.length}개 열려있음]`);
    }
  });
};

export const isMainWindow = (target: BrowserWindow) => {
  const { mainWindows } = getViewState();

  return mainWindows.includes(target);
};
