import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  webContents,
  shell,
  dialog,
} from "electron";
import log from "electron-log";
import path from "path";
import { fileURLToPath } from "url";

import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from "./constants";
import { pollUntil, PollingTimeoutError } from "./utils/polling";
import { isDev, isWindow } from "./envs";
import {
  openExternalForAuth,
  processPendingDeepLink,
  shouldOpenForDesktopAuth,
} from "./initialize/initDesktopAuth";
import i18n from "./locales/i18next";
import { getContextMenu } from "./menu";
import {
  getBoundingRect,
  getWindowState,
  saveIsMaximized,
  savePosition,
  savePositionDebounced,
  saveSize,
  saveSizeDebounced,
} from "./windowState";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  private shouldRestoreMaximized: boolean;

  constructor() {
    const prevWindowState = getWindowState();

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

    this.shouldRestoreMaximized = prevWindowState.isMaximized ?? false;
  }

  afterRegister(): void {
    if (!this.windowManager) return;

    const focusedWindow = this.windowManager.getFocusedWindow(BoxHeroWindow);

    if (focusedWindow) {
      const { x, y } = focusedWindow.getBounds();
      this.setPosition(x + 50, y + 50);
    }

    // webview에 labelPrinter preload 스크립트 주입
    this.webContents.on("will-attach-webview", (_event, webPreferences) => {
      webPreferences.preload = path.join(__dirname, "webviewPreload.js");
    });

    this.webContents.on("did-finish-load", () => {
      this.initPersistWindowState();
      // webview가 준비될 때까지 대기 후 이벤트 초기화
      void this.waitForWebviewAndInitEvents().catch((error) => {
        log.error("Unexpected error in waitForWebviewAndInitEvents:", error);
      });
      // 웹뷰가 로드되면 배경색을 제거
      this.setBackgroundColor("transparent");
    });

    this.once("ready-to-show", () => {
      if (this.shouldRestoreMaximized) {
        this.maximize();
      }
      this.show();
    });
  }

  get navStat() {
    const canGoBack =
      this.webviewContents?.navigationHistory.canGoBack() ?? false;
    const canGoForward =
      this.webviewContents?.navigationHistory.canGoForward() ?? false;

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

  /**
   * webviewContents가 준비될 때까지 대기 후 initEvents 호출
   */
  private async waitForWebviewAndInitEvents(): Promise<void> {
    try {
      await pollUntil(() => this.webviewContents);
    } catch (error) {
      if (error instanceof PollingTimeoutError) {
        log.warn("Timeout waiting for webview, initializing events anyway");
      } else {
        throw error;
      }
    }
    this.initEvents();
  }

  private initEvents() {
    this.syncNavStat();
    this.syncWindowsStat();

    this.removeAllListeners("resize").on(
      "resize",
      this.syncWindowsStat.bind(this)
    );

    if (!this.webviewContents) {
      log.warn("webviewContents not available, skipping webview event setup");
      // webviewContents 없어도 pending deep link는 처리 시도
      processPendingDeepLink();
      return;
    }

    this.removeAllListeners("app-command").on("app-command", (e, cmd) => {
      const navHistory = this.webviewContents?.navigationHistory;
      if (cmd === "browser-backward" && navHistory?.canGoBack()) {
        navHistory.goBack();
      } else if (cmd === "browser-forward" && navHistory?.canGoForward()) {
        navHistory.goForward();
      }
    });

    this.removeAllListeners("swipe").on("swipe", (e, direction) => {
      const navHistory = this.webviewContents?.navigationHistory;
      if (direction === "left" && navHistory?.canGoBack()) {
        navHistory.goBack();
      } else if (direction === "right" && navHistory?.canGoForward()) {
        navHistory.goForward();
      }
    });

    const shouldOpenExternally = (url: URL) => {
      const isAllowedHost =
        /\.boxhero\.io$/i.test(url.hostname) ||
        (isDev && url.hostname === "localhost");
      const hasOpenExternalFlag =
        url.searchParams.get("open_external") === "true";

      return hasOpenExternalFlag && isAllowedHost;
    };

    this.webviewContents.setWindowOpenHandler(({ url }) => {
      try {
        const parsedURL = new URL(url);

        if (shouldOpenExternally(parsedURL)) {
          shell.openExternal(url);
          return { action: "deny" };
        }

        return { action: "allow" };
      } catch (_e) {
        return { action: "allow" };
      }
    });

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
      })
      .on("did-create-window", (window) => {
        window.webContents.on("will-prevent-unload", (event) => {
          const choice = dialog.showMessageBoxSync(window, {
            type: "question",
            buttons: [
              i18n.t("beforeunload_leave", { ns: "window" }),
              i18n.t("beforeunload_cancel", { ns: "window" }),
            ],
            defaultId: 0,
            title: i18n.t("beforeunload_title", { ns: "window" }),
            message: i18n.t("beforeunload_message", { ns: "window" }),
          });
          if (choice === 0) {
            event.preventDefault();
          }
        });
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

    this.webviewContents
      .removeAllListeners("will-navigate")
      .on("will-navigate", (event, url) => {
        try {
          const parsedUrl = new URL(url);
          const isAllowedHost =
            /\.boxhero\.io$/i.test(parsedUrl.hostname) ||
            (isDev && parsedUrl.hostname === "localhost");

          if (isAllowedHost && shouldOpenForDesktopAuth(parsedUrl)) {
            event.preventDefault();
            openExternalForAuth(url);
          }
        } catch (error) {
          log.warn(`Failed to parse navigation URL: ${url}`, error);
        }
      });

    log.debug("ViewEvent updated.");

    // 모든 이벤트 리스너 등록 후 pending deep link 처리
    processPendingDeepLink();
  }

  private initPersistWindowState() {
    this.removeAllListeners("close").once("close", () => {
      const isMaximized = this.isMaximized();
      saveIsMaximized(isMaximized);

      // 최대화 상태일 때는 position/size를 저장하지 않음
      // (최대화 상태의 bounds는 OS에 따라 음수 좌표 등 비정상 값일 수 있음)
      if (!isMaximized) {
        const { x, y, width, height } = getBoundingRect(this);
        saveSize(width, height);
        savePosition(x, y);
      }
    });

    this.removeAllListeners("resize").on("resize", () => {
      // 최대화 상태에서는 저장하지 않음
      if (this.isMaximized()) return;
      const { width, height } = getBoundingRect(this);
      saveSizeDebounced(width, height);
    });

    this.removeAllListeners("move").on("move", () => {
      // 최대화 상태에서는 저장하지 않음
      if (this.isMaximized()) return;
      const { x, y } = getBoundingRect(this);
      savePositionDebounced(x, y);
    });
  }
}

export const windowManager = new WindowManager();
