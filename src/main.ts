import { app, BrowserWindow } from 'electron';
import { persistWindowState, getWindowState } from './utils/persistWindowState';

let mainWindow: BrowserWindow;

const createMainWindow = (url: string) => {
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

  const currentWindow = new BrowserWindow({
    ...prevWindowState.position,
    ...prevWindowState.size,
  });

  currentWindow.loadURL(url);
  persistWindowState(currentWindow);

  currentWindow.once('ready-to-show', currentWindow.show);
  return currentWindow;
};

app.on('ready', () => {
  mainWindow = createMainWindow('https://boxhero.io');
});
