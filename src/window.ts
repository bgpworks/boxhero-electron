import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  webContents,
} from "electron";
import log from "electron-log";
import path from "path";

import { isDev, isWindow } from "./envs";
import i18n from "./i18next";
import { getContextMenu } from "./menu";
import {
  getBoundingRect,
  getWindowState,
  savePosition,
  savePositionDebounced,
  saveSize,
  saveSizeDebounced,
} from "./windowState";
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from "./constants";

class WindowRegistry {
  private windows: ManagedWindow[] = [];

  register(window: ManagedWindow) {
    this.windows.push(window);

    log.debug(
      `new boxhero window registered. [currently ${this.length} windows opened]`
    );
  }

  unregister(targetWindow: ManagedWindow) {
    this.windows = this.windows.filter((window) => window !== targetWindow);

    log.debug(
      `boxhero window unregistered [currently ${this.length} windows left]`
    );
  }

  get length() {
    return this.windows.length;
  }

  getFocusedWindow() {
    return this.windows.find((w) => w.isFocused());
  }
}

abstract class ManagedWindow extends BrowserWindow {
  private readonly disposeCallbacks: (() => void)[] = [];

  constructor(
    readonly rendererPath: string,
    readonly registry: WindowRegistry,
    readonly options?: BrowserWindowConstructorOptions
  ) {
    super(options);

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      this.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}${this.rendererPath}`);
    } else {
      this.loadFile(
        path.join(
          __dirname,
          `../renderer/${MAIN_WINDOW_VITE_NAME}${this.rendererPath}`
        )
      );
    }

    this.once("closed", () => {
      this.registry.unregister(this);
      this.disposeCallbacks.forEach((cb) => cb());
    });

    this.registry.register(this);
  }

  protected registerDisposeCallback(callback: () => void) {
    this.disposeCallbacks.push(callback);
  }

  get webviewContents() {
    const childView = webContents
      .getAllWebContents()
      .find(
        (wc) =>
          wc.getType() === "webview" && wc.hostWebContents === this.webContents
      );

    return childView;
  }
}

export class BoxHeroWindow extends ManagedWindow {
  constructor(registry: WindowRegistry) {
    const prevWindowState = getWindowState({
      position: {
        x: 0,
        y: 0,
      },
      size: {
        width: 1200,
        height: 800,
      },
    });

    const focusedWindow = registry.getFocusedWindow();

    super("/templates/index.html", registry, {
      ...prevWindowState.size,
      ...prevWindowState.position,
      minWidth: MIN_WINDOW_WIDTH,
      minHeight: MIN_WINDOW_HEIGHT,
      title: "BoxHero",
      webPreferences: {
        devTools: isDev,
        webviewTag: true,
        preload: path.join(__dirname, "preload.js"),
      },
      backgroundColor: "#282c42",
      ...(isWindow ? { frame: false } : { titleBarStyle: "hiddenInset" }),
    });

    if (focusedWindow) {
      const { x, y } = focusedWindow.getBounds();
      this.setPosition(x + 50, y + 50);
    }

    this.webContents.on("did-finish-load", () => {
      this.initPersistWindowState();
      this.initEvents();
    });

    this.once("ready-to-show", () => {
      this.show();
    });
  }

  get navStat() {
    const canGoBack = this.webviewContents.canGoBack();
    const canGoForward = this.webviewContents.canGoForward();

    return {
      canGoBack,
      canGoForward,
    };
  }

  get windowStat() {
    const isMaximized = this.isMaximized();
    const isFullScreen = this.isFullScreen();

    return {
      isMaximized,
      isFullScreen,
    };
  }

  syncNavStat() {
    this.webContents.send("sync-nav-stat", this.navStat);
  }

  syncWindowsStat() {
    this.webContents.send("sync-window-stat", this.windowStat);
  }

  private initEvents() {
    this.syncNavStat();
    this.syncWindowsStat();

    this.removeAllListeners("resize").on(
      "resize",
      this.syncWindowsStat.bind(this)
    );

    // NOTE: 앱에서 열리는 결제 페이지와 도움말 페이지에 최소 크기를 설정함.
    this.webviewContents
      .removeAllListeners("did-create-window")
      .on("did-create-window", (window, detail) => {
        if (detail.disposition !== "foreground-tab") return;

        const [width, height] = window.getSize();

        window.setMinimumSize(MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT);

        window.setSize(
          Math.max(width, MIN_WINDOW_WIDTH),
          Math.max(height, MIN_WINDOW_HEIGHT)
        );
      });

    this.webviewContents
      .removeAllListeners("did-navigate")
      .on("did-navigate", this.syncNavStat.bind(this));

    this.webviewContents
      .removeAllListeners("did-navigate-in-page")
      .on("did-navigate-in-page", this.syncNavStat.bind(this));

    this.webviewContents
      .removeAllListeners("context-menu")
      .on("context-menu", (_, { x, y }) => {
        getContextMenu(i18n).popup({ x, y });
      });

    this.webviewContents
      .removeAllListeners("did-start-loading")
      .on("did-start-loading", () => {
        this.webContents.send("contents-did-start-loading");
      });

    this.webviewContents
      .removeAllListeners("did-stop-loading")
      .on("did-stop-loading", () => {
        this.webContents.send("contents-did-stop-loading");
      });

    log.debug("ViewEvent updated.");
  }

  private initPersistWindowState() {
    this.removeAllListeners("close").once("close", () => {
      const { x, y, width, height } = getBoundingRect(this);
      saveSize(width, height);
      savePosition(x, y);
    });

    this.removeAllListeners("resize").on("resize", () => {
      const { width, height } = getBoundingRect(this);
      saveSizeDebounced(width, height);
    });

    this.removeAllListeners("move").on("move", () => {
      const { x, y } = getBoundingRect(this);
      savePositionDebounced(x, y);
    });
  }
}

export const windowRegistry = new WindowRegistry();
