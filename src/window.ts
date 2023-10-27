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
import { getWindowState, persistWindowState } from "./windowState";

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

    super("/templates/index.html", registry, {
      ...prevWindowState.size,
      ...prevWindowState.position,
      minWidth: 1000,
      minHeight: 562,
      title: "BoxHero",
      webPreferences: {
        devTools: isDev,
        webviewTag: true,
        preload: path.join(__dirname, "preload.js"),
      },
      backgroundColor: "#282c42",
      ...(isWindow ? { frame: false } : { titleBarStyle: "hiddenInset" }),
    });

    const focusedWindow = registry.getFocusedWindow();

    if (focusedWindow) {
      const { x, y } = focusedWindow.getBounds();
      this.setPosition(x + 50, y + 50);
    }

    this.webContents.once("did-finish-load", () => {
      persistWindowState(this);
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
    this.on("resize", this.syncWindowsStat.bind(this));

    this.webviewContents
      .on("did-navigate", this.syncNavStat.bind(this))
      .on("did-navigate-in-page", this.syncNavStat.bind(this))
      .on("context-menu", (_, { x, y }) => {
        getContextMenu(i18n).popup({ x, y });
      })
      .on("did-start-loading", () => {
        this.webContents.send("contents-did-start-loading");
      })
      .on("did-stop-loading", () => {
        this.webContents.send("contents-did-stop-loading");
      });

    log.debug("ViewEvent updated.");
  }
}

export const windowRegistry = new WindowRegistry();
