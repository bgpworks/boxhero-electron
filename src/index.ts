import { app, BrowserWindow, Menu, session } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import Store from './store';

log.transports.file.level = "info"
autoUpdater.logger = log
autoUpdater.checkForUpdatesAndNotify()

log.info('App starting...');

const debug = /--debug/.test(process.argv[2])

const MIN_WIDTH = 1024;
const MIN_HEIGHT = 700;
const HOST_URL = 'https://app.boxhero.io/login';

const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    windowBounds: {
      width: MIN_WIDTH,
      height: MIN_HEIGHT,
    },
    // last url?
  }
});

app.setName('BoxHero');

//-------------------------------------------------------------------
// Define the menu
//-------------------------------------------------------------------
const isMac = process.platform === 'darwin'

const template:(Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [
  {role: "appMenu"}
];

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let windows:BrowserWindow[] = [];

function createWindow () {
  const { width, height } = store.get('windowBounds');
  // Create the browser window.
  const win = new BrowserWindow({
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    width: width,
    height: height,
    backgroundColor: '#F1F4F9',
    title: 'Box Hero',
    // titleBarStyle: 'hidden'
    webPreferences: {
      devTools: debug,
      nativeWindowOpen: true,// window.open return Window object(like in regular browsers), not BrowserWindowProxy
    },
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadURL(HOST_URL);

  // Launch fullscreen with DevTools open, usage: npm run debug
  if (debug) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    windows = windows.filter((v, idx, arr) => v !== win)
  });

  win.on('resize', () => {
    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    let { width, height } = win.getBounds();
    // Now that we have them, save them using the `set` method.
    store.set('windowBounds', { width, height });
  });

  windows.push(win);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
    // app.quit();
  // }
  app.quit();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (windows.length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('ready', function()  {
  autoUpdater
    .checkForUpdatesAndNotify()
    .catch((err) => {
      log.error(err);
    });
});
