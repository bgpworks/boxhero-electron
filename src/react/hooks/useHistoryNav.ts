import { useState, useEffect } from 'react';
import { TitleBarNavStat } from '../../@types/titlebar';
import { ipcRenderer } from '../fromElectron';

const initNavState: TitleBarNavStat = {
  canGoBack: false,
  canGoForward: false,
};

export const useHistoryNav = () => {
  const [{ canGoBack, canGoForward }, setNavState] = useState(initNavState);

  useEffect(() => {
    const listener = (_: unknown, newNavStat: TitleBarNavStat) => {
      setNavState(newNavStat);
    };

    ipcRenderer.on('sync-nav-stat', listener);

    return () => {
      ipcRenderer.off('sync-nav-stat', listener);
    };
  }, [setNavState]);

  return {
    canGoBack,
    canGoForward,
  };
};
