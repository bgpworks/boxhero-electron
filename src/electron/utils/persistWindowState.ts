import path from 'path';
import fs, { writeFileSync } from 'fs';
import { app, BrowserWindow } from 'electron';
import debounce from 'lodash.debounce';

const logFileName = 'window_state.json';
let logPath: string;

interface WindowState {
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

const defaultState: WindowState = {
  position: {
    x: 0,
    y: 0,
  },
  size: {
    width: 1000,
    height: 562,
  },
};

const getWindowStateLogPath = () => {
  if (logPath) return logPath;

  logPath = path.resolve(app.getPath('userData'), logFileName);

  return logPath;
};

const setWindowState = <k extends keyof WindowState>(
  key: k,
  value: WindowState[k]
) => {
  const logPath = getWindowStateLogPath();
  const prevState = getWindowState(defaultState);
  const newState = {
    ...prevState,
    ...{ [key]: value },
  };

  const logJson = JSON.stringify(newState, null, 2);
  writeFileSync(logPath, logJson, 'utf-8');
};

export const getWindowState = (defaultState: WindowState): WindowState => {
  let windowStateTmp: Partial<WindowState> = {};

  try {
    const logPath = getWindowStateLogPath();
    const logText = fs.readFileSync(logPath, 'utf-8');

    windowStateTmp = JSON.parse(logText);

    if (typeof windowStateTmp !== 'object') throw new Error();
  } catch {
    return defaultState;
  }

  return { ...defaultState, ...windowStateTmp };
};

const saveSize = (targetWindow: BrowserWindow) => {
  const [width, height] = targetWindow.getSize();
  setWindowState('size', { width, height });
};

const savePosition = (targetWindow: BrowserWindow) => {
  const [x, y] = targetWindow.getPosition();
  setWindowState('position', { x, y });
};

const saveSizeDebounced = debounce(saveSize, 300);
const savePositionDebounced = debounce(savePosition, 300);

export const persistWindowState = (targetWindow: BrowserWindow) => {
  targetWindow.once('close', () => {
    saveSize(targetWindow);
    savePosition(targetWindow);
  });

  targetWindow.on('resize', () => {
    saveSizeDebounced(targetWindow);
  });

  targetWindow.on('move', () => {
    savePositionDebounced(targetWindow);
  });
};
