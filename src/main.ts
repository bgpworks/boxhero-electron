import path from 'path';
import { app, BrowserWindow } from 'electron';
import { persistWindowState, getWindowState } from './utils/persistWindowState';
import { createMainWindow } from './window';

let mainWindow: BrowserWindow;

app.on('ready', () => {
  const prevWindowState = getWindowState({
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 1024,
      height: 768,
    },
  });

  mainWindow = createMainWindow('https://web.boxhero-app.com', {
    ...prevWindowState.position,
    ...prevWindowState.size,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: true,
      devTools: true,
      preload: path.resolve(app.getAppPath(), './out/titlebar.js'),
    },
    titleBarStyle: 'hidden', // 맥OS에서만 사용 가능한 옵션. 일부 타이틀바 구성요소를 살려둔다. 윈도에서는 frame 프롭을 설정해야됨.
  });

  mainWindow.webContents.openDevTools();

  persistWindowState(mainWindow);
});
