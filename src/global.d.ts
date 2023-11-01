export declare global {
  interface electronAPI {
    platform: typeof process.platform;
    navigation: {
      goBack: () => Promise<void>;
      goForward: () => Promise<void>;
      reload: () => Promise<void>;
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
      onSyncLoading: (callback: unknown) => void;
      offSyncLoading: (callback: unknown) => void;
    };
    app: {
      openMainMenu: () => Promise<void>;
      openExternal: (url: string) => Promise<void>;
      getLocale: () => Promise<string>;
    };
  }

  interface Window {
    electronAPI: electronAPI;
  }
}
