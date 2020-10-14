import {app, BrowserWindow} from 'electron';

let mainWindow: BrowserWindow;

const createMainWindow = () => {
  const currentWindow = new BrowserWindow({
    width: 500,
    height: 500,
  });

  currentWindow.once('ready-to-show', currentWindow.show);
  mainWindow = currentWindow;
};

app.on('ready', () => createMainWindow());
