/* eslint-disable @typescript-eslint/no-explicit-any */
import { IpcRenderer } from "electron";

import { TitleBarWindowStat } from "./types/titlebar";

export declare global {
  interface Window {
    electronAPI: {
      platform: typeof process.platform;
      history: {
        goBack: () => Promise<void>;
        goForward: () => Promise<void>;
        refresh: () => Promise<void>;
        onSyncNav: (callback: any) => void;
        offSyncNav: (callback: any) => void;
      };
      window: {
        toggleMaximize: () => Promise<void>;
        minimize: () => Promise<void>;
        maximize: () => Promise<void>;
        close: () => Promise<void>;
        getWindowStat: () => Promise<TitleBarWindowStat>;
        onSyncWindowStat: (callback: any) => void;
        offSyncWindowStat: (callback: any) => void;
      };
      contents: {
        onStartLoading: (callback: any) => void;
        offStartLoading: (callback: any) => void;
        onStopLoading: (callback: any) => void;
        offStopLoading: (callback: any) => void;
      };
      main: {
        openMainMenu: () => Promise<void>;
        openExternal: (url: string) => Promise<void>;
        getAppLocale: () => Promise<string>;
      };
    };
  }
}
