import { app, BrowserWindow } from "electron";
import log from "electron-log";
import fs, { writeFileSync } from "fs";
import debounce from "lodash/debounce";
import path from "path";

const lastWindowStateFileName = "window_state.json";
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
    const logText = fs.readFileSync(lastWindowStateFilePath, "utf-8");

    windowStateTmp = JSON.parse(logText);

    if (typeof windowStateTmp !== "object")
      throw new Error("typeof windowStateTmp !== 'object'");
  } catch (e) {
    log.error(`Failed to read window state [${(e as Error).message}]`);
    return defaultState;
  }

  return { ...defaultState, ...windowStateTmp };
};

const getWindowStatePath = () => {
  if (lastWindowStateFilePath) return lastWindowStateFilePath;

  lastWindowStateFilePath = path.resolve(
    app.getPath("userData"),
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
    writeFileSync(statePath, logJson, "utf-8");
  } catch (e) {
    // silent fail
    log.error(`Failed to write window state [${(e as Error).message}]`);
    return;
  }
};

export const saveSize = (width: number, height: number) => {
  setWindowState("size", { width, height });

  log.debug(`Saved the window size [width : ${width} , height : ${height}]`);
};

export const savePosition = (x: number, y: number) => {
  setWindowState("position", { x, y });

  log.debug(`Saved the window position [x : ${x} , y : ${y}]`);
};

export const saveSizeDebounced = debounce(saveSize, 300);
export const savePositionDebounced = debounce(savePosition, 300);

export const getBoundingRect = (targetWindow: BrowserWindow) => {
  const [x, y] = targetWindow.getPosition();
  const [width, height] = targetWindow.getSize();

  return { x, y, width, height };
};
