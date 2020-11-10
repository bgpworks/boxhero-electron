import path from 'path';
import fs, { writeFileSync } from 'fs';
import { app, BrowserWindow } from 'electron';
import log from 'electron-log';
import debounce from 'lodash.debounce';
import { isDev } from '../envs';

const lastWindowStateFileName = 'window_state.json';
let lastWindowStateFilePath: string;

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

const initialState: WindowState = {
  position: {
    x: 0,
    y: 0,
  },
  size: {
    width: 1000,
    height: 562,
  },
};

export const getWindowState = (
  defaultState: WindowState = initialState
): WindowState => {
  let windowStateTmp: Partial<WindowState> = {};

  try {
    const lastWindowStateFilePath = getWindowStatePath();
    const logText = fs.readFileSync(lastWindowStateFilePath, 'utf-8');

    windowStateTmp = JSON.parse(logText);

    if (typeof windowStateTmp !== 'object')
      throw new Error("typeof windowStateTmp !== 'object'");
  } catch (e) {
    log.error(`window state 파일 읽기에 실패. [${e.message}]`);
    return defaultState;
  }

  return { ...defaultState, ...windowStateTmp };
};

const getWindowStatePath = () => {
  if (lastWindowStateFilePath) return lastWindowStateFilePath;

  lastWindowStateFilePath = path.resolve(
    app.getPath('userData'),
    lastWindowStateFileName
  );

  return lastWindowStateFilePath;
};

const setWindowState = <k extends keyof WindowState>(
  key: k,
  value: WindowState[k]
) => {
  const statePath = getWindowStatePath();
  const prevState = getWindowState();
  const newState = {
    ...prevState,
    ...{ [key]: value },
  };

  const logJson = JSON.stringify(newState, null, 2);
  try {
    writeFileSync(statePath, logJson, 'utf-8');
  } catch (e) {
    // silent fail
    log.error(`윈도우 상태 쓰기를 실패함. [${e.message}]`);
    return;
  }
};

const saveSize = (targetWindow: BrowserWindow) => {
  const [width, height] = targetWindow.getSize();
  setWindowState('size', { width, height });

  if (isDev) {
    log.log(`윈도우 크기 기록함 [width : ${width} , height : ${height}]`);
  }
};

const savePosition = (targetWindow: BrowserWindow) => {
  const [x, y] = targetWindow.getPosition();
  setWindowState('position', { x, y });

  if (isDev) {
    log.log(`윈도우 위치 기록함 [x : ${x} , y : ${y}]`);
  }
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
