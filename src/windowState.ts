import { app, BrowserWindow, screen } from "electron";
import log from "electron-log";
import fs, { writeFileSync } from "fs";
import debounce from "lodash/debounce";
import path from "path";

const lastWindowStateFileName = "window_state.json";
let lastWindowStateFilePath: string;

const MINIMUM_VISIBLE_SIZE = 200;

interface WindowState {
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  isMaximized?: boolean;
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

const isWindowWithinBounds = (state: WindowState): boolean => {
  const displays = screen.getAllDisplays();

  // 윈도우 영역
  const topRect = {
    left: state.position.x,
    top: state.position.y,
    right: state.position.x + state.size.width,
    bottom: state.position.y + state.size.height,
  };

  // 상단 영역이 MINIMUM_VISIBLE_SIZE x MINIMUM_VISIBLE_SIZE 이상 보이는 디스플레이가 있으면 OK
  return displays.some((display) => {
    const { x, y, width, height } = display.bounds;

    // 교차 영역 계산
    const overlapLeft = Math.max(topRect.left, x);
    const overlapTop = Math.max(topRect.top, y);
    const overlapRight = Math.min(topRect.right, x + width);
    const overlapBottom = Math.min(topRect.bottom, y + height);

    const overlapWidth = Math.max(0, overlapRight - overlapLeft);
    const overlapHeight = Math.max(0, overlapBottom - overlapTop);

    const isVisible =
      overlapWidth >= MINIMUM_VISIBLE_SIZE &&
      overlapHeight >= MINIMUM_VISIBLE_SIZE;

    log.debug(
      `Display bounds: (${x}, ${y}, ${width}x${height}), ` +
        `topRect: (${topRect.left}, ${topRect.top}) ~ (${topRect.right}, ${topRect.bottom}), ` +
        `overlap: ${overlapWidth}x${overlapHeight}, visible: ${isVisible}`
    );

    return isVisible;
  });
};

const readWindowState = (
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

export const getWindowState = (
  defaultState: WindowState = initialState
): WindowState => {
  const savedState = readWindowState(defaultState);

  // 화면 밖이면 기본값 사용
  if (!isWindowWithinBounds(savedState)) {
    log.debug("Window is out of bounds, using default state");
    return defaultState;
  }

  return savedState;
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
  const prevState = readWindowState();
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

export const saveIsMaximized = (isMaximized: boolean) => {
  setWindowState("isMaximized", isMaximized);

  log.debug(`Saved the window isMaximized [${isMaximized}]`);
};

export const saveSizeDebounced = debounce(saveSize, 300);
export const savePositionDebounced = debounce(savePosition, 300);

export const getBoundingRect = (targetWindow: BrowserWindow) => {
  const [x, y] = targetWindow.getPosition();
  const [width, height] = targetWindow.getSize();

  return { x, y, width, height };
};
