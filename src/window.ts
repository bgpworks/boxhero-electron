import { BrowserWindowConstructorOptions, BrowserWindow } from 'electron';

export const createMainWindow = (url: string, extOpts?: BrowserWindowConstructorOptions) => {
  const currentWindow = new BrowserWindow({
    ...(extOpts ? extOpts : {}),
  });

  currentWindow.loadURL(url);
  currentWindow.once('ready-to-show', currentWindow.show);

  return currentWindow;
};
