import { useState, useEffect } from 'react';
import { TitleBarWindowStat } from '../../@types/titlebar';
import { ipcRenderer, windowMethods } from '../fromElectron';

const initialStat: TitleBarWindowStat = {
  isFullScreen: false,
  isMaximized: false,
};

export const useWindowNav = () => {
  const [{ isMaximized, isFullScreen }, setWinStat] = useState(initialStat);
  const { getWindowStat } = windowMethods;

  useEffect(() => {
    getWindowStat().then((initWinStat) => setWinStat(initWinStat));

    const listener = (_: unknown, newWinStat: TitleBarWindowStat) => {
      setWinStat(newWinStat);
    };

    ipcRenderer.on('sync-window-stat', listener);

    return () => {
      ipcRenderer.off('sync-window-stat', listener);
    };
  }, [setWinStat, getWindowStat]);

  return {
    isMaximized,
    isFullScreen,
  };
};
