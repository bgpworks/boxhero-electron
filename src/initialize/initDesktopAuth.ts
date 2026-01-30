import { app, shell } from "electron";
import log from "electron-log";
import path from "path";

import { AUTH_CALLBACK_PATH, CUSTOM_PROTOCOL } from "../constants";
import { isMac } from "../envs";
import { pollUntil, PollingTimeoutError } from "../utils/polling";
import { BoxHeroWindow, windowManager } from "../window";

declare const __ENABLE_GOTO_DEEP_LINK__: boolean;

// macOS cold start 시 앱이 ready되기 전에 open-url이 발생할 수 있음
// 이 경우 딥링크를 저장해두고 윈도우가 준비되면 처리
let pendingDeepLink: string | null = null;

/**
 * URL이 외부 브라우저에서 열려야 하는 데스크탑 인증 URL인지 확인
 */
export function shouldOpenForDesktopAuth(url: URL): boolean {
  return url.pathname === "/desktop-auth";
}

/**
 * boxhero://auth?code=xxx 형식의 딥링크를 파싱
 */
export function parseAuthDeepLink(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol !== `${CUSTOM_PROTOCOL}:`) {
      return null;
    }

    if (parsedUrl.hostname !== "auth") {
      return null;
    }

    const code = parsedUrl.searchParams.get("code");
    return code;
  } catch (error) {
    log.warn("Failed to parse auth deep link:", error);
    return null;
  }
}

/**
 * boxhero://goto?url=xxx 형식의 딥링크를 파싱
 */
function parseGotoDeepLink(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol !== `${CUSTOM_PROTOCOL}:`) {
      return null;
    }

    if (parsedUrl.hostname !== "goto") {
      return null;
    }

    return parsedUrl.searchParams.get("url");
  } catch {
    return null;
  }
}

/**
 * 윈도우의 webviewContents가 준비될 때까지 대기
 * @throws {PollingTimeoutError} 타임아웃 시
 */
async function waitForWebviewReady(
  window: BoxHeroWindow
): Promise<Electron.WebContents> {
  return pollUntil(() => window.webviewContents);
}

/**
 * goto 딥링크 처리 (베타/개발 모드에서만 동작)
 * 프로덕션 빌드에서는 이 함수가 tree-shaking으로 제거됨
 */
async function handleGotoDeepLink(targetUrl: string): Promise<void> {
  const windows = windowManager.getWindows(BoxHeroWindow);
  const existingWindow = windows[0];

  if (!existingWindow) {
    // 윈도우가 없으면 pending으로 저장 (main.ts에서 윈도우 열림)
    log.warn("No BoxHeroWindow available for goto, saving as pending");
    pendingDeepLink = `${CUSTOM_PROTOCOL}://goto?url=${encodeURIComponent(targetUrl)}`;
    return;
  }

  try {
    await waitForWebviewReady(existingWindow);
    existingWindow.webviewContents?.loadURL(targetUrl);
    existingWindow.focus();
  } catch (error) {
    if (error instanceof PollingTimeoutError) {
      // 타임아웃 시 pending으로 저장
      log.warn("Webview not ready for goto, saving as pending");
      pendingDeepLink = `${CUSTOM_PROTOCOL}://goto?url=${encodeURIComponent(targetUrl)}`;
    } else {
      throw error;
    }
  }
}

/**
 * 인증 코드로 webview를 /desktop-login?code=xxx로 네비게이트
 */
export async function completeDesktopAuth(code: string): Promise<void> {
  const windows = windowManager.getWindows(BoxHeroWindow);
  const targetWindow = windows[0];

  if (!targetWindow) {
    log.warn("No BoxHeroWindow available to complete auth, waiting for window");
    // 윈도우가 없으면 pending으로 저장하고 main.ts에서 윈도우를 열도록 함
    // 이렇게 하면 중복 윈도우 생성을 방지할 수 있음
    pendingDeepLink = `${CUSTOM_PROTOCOL}://auth?code=${encodeURIComponent(code)}`;
    return;
  }

  try {
    await waitForWebviewReady(targetWindow);
    navigateToAuthCallback(targetWindow, code);
  } catch (error) {
    if (error instanceof PollingTimeoutError) {
      // 타임아웃 시 pending으로 저장하여 나중에 재시도
      log.warn("Webview not ready for auth, saving as pending");
      pendingDeepLink = `${CUSTOM_PROTOCOL}://auth?code=${encodeURIComponent(code)}`;
    } else {
      throw error;
    }
  }
}

const ALLOWED_BASE_URLS = [
  "https://app.boxhero.io",
  "https://dev.boxhero.io",
] as const;

const DEFAULT_BASE_URL = "https://app.boxhero.io";

function getBaseUrl(currentUrl: string): string {
  try {
    const parsedUrl = new URL(currentUrl);
    const origin = parsedUrl.origin;

    if (
      ALLOWED_BASE_URLS.includes(origin as (typeof ALLOWED_BASE_URLS)[number])
    ) {
      return origin;
    }

    log.warn(`Current origin ${origin} is not allowed, using default`);
    return DEFAULT_BASE_URL;
  } catch {
    log.warn(`Failed to parse current URL: ${currentUrl}, using default`);
    return DEFAULT_BASE_URL;
  }
}

function navigateToAuthCallback(window: BoxHeroWindow, code: string): void {
  const webviewContents = window.webviewContents;

  if (!webviewContents) {
    log.error("Webview not ready, cannot complete desktop auth");
    return;
  }

  const currentUrl = webviewContents.getURL();
  const baseUrl = getBaseUrl(currentUrl);
  const authUrl = `${baseUrl}${AUTH_CALLBACK_PATH}?code=${encodeURIComponent(code)}`;

  // 보안: code 값은 로그에 마스킹
  log.info(
    `Navigating to auth callback: ${baseUrl}${AUTH_CALLBACK_PATH}?code=***`
  );
  webviewContents.loadURL(authUrl);

  window.focus();
}

/**
 * 로그용으로 딥링크 URL에서 민감한 정보를 마스킹
 */
function maskDeepLinkForLog(url: string): string {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.searchParams.has("code")) {
      parsedUrl.searchParams.set("code", "***");
    }
    return parsedUrl.toString();
  } catch {
    return url;
  }
}

/**
 * 딥링크 처리 진입점 (main.ts에서 호출)
 * 내부에서 발생하는 에러는 모두 처리되므로 fire-and-forget 패턴 사용
 */
export function handleDeepLink(url: string): void {
  log.info(`Handling deep link: ${maskDeepLinkForLog(url)}`);

  // auth 딥링크 처리
  const code = parseAuthDeepLink(url);
  if (code) {
    log.info("Auth code received");
    void completeDesktopAuth(code).catch((error) => {
      log.error("Unexpected error in completeDesktopAuth:", error);
    });
    return;
  }

  // goto 딥링크 처리 (dev/beta 빌드에서만 활성화)
  if (__ENABLE_GOTO_DEEP_LINK__) {
    const targetUrl = parseGotoDeepLink(url);
    if (targetUrl) {
      log.info(`Goto deep link received: ${targetUrl}`);
      void handleGotoDeepLink(targetUrl).catch((error) => {
        log.error("Unexpected error in handleGotoDeepLink:", error);
      });
      return;
    }
  }

  log.warn(`Unknown deep link: ${url}`);
}

/**
 * 외부 브라우저로 URL 열기 (window.ts에서 호출)
 */
export function openExternalForAuth(url: string): void {
  log.info(`Opening external browser for auth: ${url}`);
  shell.openExternal(url);
}

function registerProtocol() {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(CUSTOM_PROTOCOL, process.execPath, [
        path.resolve(process.argv[1]),
      ]);
    }
  } else {
    app.setAsDefaultProtocolClient(CUSTOM_PROTOCOL);
  }
}

function getDeepLinkFromArgs(args: string[]): string | undefined {
  return args.find((arg) => arg.startsWith(`${CUSTOM_PROTOCOL}://`));
}

async function waitForWindowAndHandle(deepLinkUrl: string): Promise<void> {
  try {
    await pollUntil(() => {
      const windows = windowManager.getWindows(BoxHeroWindow);
      return windows[0]?.webviewContents;
    });
    handleDeepLink(deepLinkUrl);
  } catch (error) {
    if (error instanceof PollingTimeoutError) {
      // 타임아웃 시 pending으로 저장하고 윈도우가 준비되면 처리하도록 함
      log.warn("Timeout waiting for window, saving as pending deep link");
      pendingDeepLink = deepLinkUrl;
    } else {
      throw error;
    }
  }
}

/**
 * 윈도우가 준비된 후 pending deep link가 있으면 처리
 * BoxHeroWindow.afterRegister()에서 호출
 */
export function processPendingDeepLink(): void {
  if (pendingDeepLink) {
    const url = pendingDeepLink;
    pendingDeepLink = null;
    log.info("Processing pending deep link");
    handleDeepLink(url);
  }
}

/**
 * 데스크탑 인증 초기화 (app ready 전에 호출해야 함)
 * @returns false면 앱 종료 필요 (다른 인스턴스가 이미 실행 중)
 */
function initDesktopAuth(): boolean {
  log.info("Initializing desktop auth...");

  // Register custom protocol
  registerProtocol();

  // Windows/Linux: Single instance lock and deep link handling
  if (!isMac) {
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      log.info("Another instance is running, quitting...");
      app.quit();
      return false;
    }

    app.on("second-instance", (_, commandLine) => {
      log.debug("Second instance detected");

      const deepLinkUrl = getDeepLinkFromArgs(commandLine);
      if (deepLinkUrl) {
        handleDeepLink(deepLinkUrl);
      }

      // Focus existing window
      const windows = windowManager.getWindows(BoxHeroWindow);
      if (windows.length > 0) {
        const mainWindow = windows[0];
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();
      }
    });

    // Handle cold start deep link
    app.once("ready", () => {
      const deepLinkUrl = getDeepLinkFromArgs(process.argv);
      if (deepLinkUrl) {
        log.info(
          `Cold start with deep link: ${maskDeepLinkForLog(deepLinkUrl)}`
        );
        void waitForWindowAndHandle(deepLinkUrl).catch((error) => {
          log.error("Unexpected error in waitForWindowAndHandle:", error);
        });
      }
    });
  }

  // macOS: Handle deep links via open-url event
  if (isMac) {
    app.on("open-url", (event, url) => {
      event.preventDefault();
      log.debug(`Received open-url event: ${maskDeepLinkForLog(url)}`);
      handleDeepLink(url);
    });
  }

  log.info("Desktop auth module initialized");
  return true;
}

export default initDesktopAuth;
