import { app, BrowserWindow, Menu, session, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import {
  MIN_WIDTH,
  MIN_HEIGHT,
  APP_NAME,
  HOST_URL,
  SUPPORT_URLS,
} from './constants';
import Store from './store';

//-------------------------------------------------------------------
// Envs
//-------------------------------------------------------------------

const isDebug = process.env['DEBUG'] ? true : false;
const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';
const isLinux = process.platform === 'linux';

//-------------------------------------------------------------------
// Initial Setup
//-------------------------------------------------------------------

app.setName(APP_NAME);

const store = new Store({
  configName: 'user-preferences',
});

log.transports.file.level = 'info';
autoUpdater.logger = log;
autoUpdater.checkForUpdatesAndNotify();

log.info('App starting...');

//-------------------------------------------------------------------
// Define the menu
//-------------------------------------------------------------------

const appMenu: Electron.MenuItemConstructorOptions = {
  label: app.name,
  submenu: [
    { role: 'about' },
    { type: 'separator' },
    { role: 'services' },
    { type: 'separator' },
    { role: 'hide' },
    { role: 'unhide' },
    { type: 'separator' },
    { role: 'quit' },
  ],
};

export const openURL = (url: string) => async () => {
  await shell.openExternal(url);
};

const template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [
  ...(isMac ? [appMenu] : []),
  {
    label: '도움말',
    submenu: [
      { label: '고객센터', click: openURL(SUPPORT_URLS.HOME) },
      { label: '자주 묻는 질문', click: openURL(SUPPORT_URLS.FAQ) },
      { label: '서비스 매뉴얼', click: openURL(SUPPORT_URLS.MANUAL) },
    ],
  },
];

// 윈도 객체들에 대한 참조를 유지한다. 그렇지 않으면, GC될 때 윈도가 닫힌다.
let windows: BrowserWindow[] = [];

function createWindow() {
  const { width, height } = store.get('windowBounds');
  // Create the browser window.
  const currentWindow = new BrowserWindow({
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    width: width,
    height: height,
    backgroundColor: '#F1F4F9',
    title: 'Box Hero',
    // titleBarStyle: 'hidden',
    webPreferences: {
      devTools: isDebug,
      nativeWindowOpen: true, // window.open return Window object(like in regular browsers), not BrowserWindowProxy
    },
  });

  currentWindow.loadURL(HOST_URL);

  currentWindow.once('ready-to-show', () => {
    currentWindow.show();
  });

  // 윈도가 닫힐 시 실행
  currentWindow.on('closed', () => {
    // GC가 되도록 닫힌 윈도에 대한 참조를 제거한다.
    windows = windows.filter((window) => window !== currentWindow);
  });

  currentWindow.on('resize', () => {
    let { width, height } = currentWindow.getBounds();
    store.set('windowBounds', { width, height });
  });

  windows.push(currentWindow);
}

//-------------------------------------------------------------------
// App 생명주기
//-------------------------------------------------------------------

// 이 메서드는 일렉트론이 초기화를 마치고 새로운 윈도우를 생성할 준비가 되었을 때 실행된다.
// 일부 API들은 이 이벤트 이후에만 사용이 가능하다.
app.on('ready', () => {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  createWindow();
});

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

app.on('activate', () => {
  // 맥OS에서는 열려있는 윈도가 없는 상태에서 dock icon을 클릭했을 때 새로운 윈도를 생성하는 것이 일반적이다.
  if (windows.length === 0) {
    createWindow();
  }
});
