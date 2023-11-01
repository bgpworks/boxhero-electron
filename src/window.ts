import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  webContents,
} from "electron";
import log from "electron-log";
import path from "path";

import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from "./constants";
import { isDev, isWindow } from "./envs";
import i18n from "./locales/i18next";
import { getContextMenu } from "./menu";
import {
  getBoundingRect,
  getWindowState,
  savePosition,
  savePositionDebounced,
  saveSize,
  saveSizeDebounced,
} from "./windowState";

type ViteWindowConstructor<T extends ViteWindow = ViteWindow> = new (
  ...args: unknown[]
) => T;

class WindowManager {
  private registry: Map<ViteWindowConstructor, ViteWindow[]> = new Map();

  getWindows<T extends ViteWindowConstructor>(
    typeClass?: T
  ): InstanceType<T>[] {
    if (!typeClass) {
      return [...this.registry.values()].flat() as InstanceType<T>[];
    }

    const windows = this.registry.get(typeClass) ?? [];
    this.registry.set(typeClass, windows);

    return windows as InstanceType<T>[];
  }

  private register(typeClass: ViteWindowConstructor, window: ViteWindow) {
    const windows = this.getWindows(typeClass);
    windows.push(window);

    window.windowManager = this;
    window.afterRegister();

    log.debug(
      `new ${typeClass.name} registered. [currently ${this.getSize(
        typeClass
      )} windows opened]`
    );

    return windows;
  }

  private unregister(
    typeClass: ViteWindowConstructor,
    targetWindow: ViteWindow
  ) {
    const windows = this.getWindows(typeClass);

    this.registry.set(
      typeClass,
      windows.filter((window) => window !== targetWindow)
    );

    log.debug(
      `${typeClass.name} unregistered [currently ${this.getSize(
        typeClass
      )} windows left]`
    );

    return this.getWindows(typeClass);
  }

  open<T extends ViteWindowConstructor>(
    typeClass: T,
    ...args: ConstructorParameters<T>
  ) {
    const newWindow = new typeClass(...args);

    this.register(typeClass, newWindow);

    newWindow.once("closed", () => {
      this.unregister(typeClass, newWindow);
    });

    return newWindow;
  }

  getFocusedWindow<T extends ViteWindowConstructor>(
    typeClass?: T
  ): InstanceType<T> | undefined {
    const windows = this.getWindows(typeClass);

    return windows.find((window) => window.isFocused());
  }

  getSize(typeClass?: ViteWindowConstructor) {
    const windows = this.getWindows(typeClass);

    return windows.length;
  }
}

abstract class ViteWindow extends BrowserWindow {
  windowManager?: WindowManager;

  constructor(
    readonly rendererPath: string,
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

  abstract afterRegister(): void | Promise<void>;
}

export class BoxHeroWindow extends ViteWindow {
  constructor() {
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

    super("/templates/main.html", {
      ...prevWindowState.size,
      ...prevWindowState.position,
      show: false,
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
  }

  afterRegister(): void {
    if (!this.windowManager) return;

    const focusedWindow = this.windowManager.getFocusedWindow(BoxHeroWindow);

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
    const canGoBack = this.webviewContents?.canGoBack() ?? false;
    const canGoForward = this.webviewContents?.canGoForward() ?? false;

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

  private syncNavStat() {
    this.webContents.send("sync/nav-stat", this.navStat);
  }

  private syncWindowsStat() {
    this.webContents.send("sync/window-stat", this.windowStat);
  }

  private initEvents() {
    this.syncNavStat();
    this.syncWindowsStat();

    this.removeAllListeners("resize").on(
      "resize",
      this.syncWindowsStat.bind(this)
    );

    if (!this.webviewContents) return;

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
      })
      .on("did-create-window", (window, detail) => {
        if (detail.disposition === "default") return;

        window.setMenuBarVisibility(false);
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
        this.webContents.send("sync/loading", true);
      });

    this.webviewContents
      .removeAllListeners("did-stop-loading")
      .on("did-stop-loading", () => {
        this.webContents.send("sync/loading", false);
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

export const windowManager = new WindowManager();
