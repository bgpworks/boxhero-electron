export declare global {
  interface electronAPI {
    platform: typeof process.platform;
    history: {
      goBack: () => Promise<void>;
      goForward: () => Promise<void>;
      refresh: () => Promise<void>;
      onSyncNav: (callback: unknown) => void;
      offSyncNav: (callback: unknown) => void;
    };
    window: {
      toggleMaximize: () => Promise<void>;
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;
      getWindowStat: () => Promise<{
        isMaximized: boolean;
        isFullScreen: boolean;
      }>;
      onSyncWindowStat: (callback: unknown) => void;
      offSyncWindowStat: (callback: unknown) => void;
    };
    loading: {
      onStartLoading: (callback: unknown) => void;
      offStartLoading: (callback: unknown) => void;
      onStopLoading: (callback: unknown) => void;
      offStopLoading: (callback: unknown) => void;
    };
    main: {
      openMainMenu: () => Promise<void>;
      openExternal: (url: string) => Promise<void>;
      getAppLocale: () => Promise<string>;
    };
  }

  interface Window {
    electronAPI: electronAPI;
  }
}
