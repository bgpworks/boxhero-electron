import { useEffect, useState } from "react";

import { TitleBarWindowStat } from "../../../types/titlebar";

const initialStat: TitleBarWindowStat = {
  isFullScreen: false,
  isMaximized: false,
};

export const useWindowNav = () => {
  const [{ isMaximized, isFullScreen }, setWinStat] = useState(initialStat);
  const { getWindowStat } = window.electronAPI.window;

  useEffect(() => {
    getWindowStat().then((initWinStat) => setWinStat(initWinStat));

    const listener = (_: unknown, newWinStat: TitleBarWindowStat) => {
      setWinStat(newWinStat);
    };

    window.electronAPI.window.onSyncWindowStat(listener);

    return () => {
      window.electronAPI.window.offSyncWindowStat(listener);
    };
  }, [setWinStat, getWindowStat]);

  return {
    isMaximized,
    isFullScreen,
  };
};
