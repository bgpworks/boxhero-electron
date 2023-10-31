import { useEffect, useState } from "react";

const initialStat = {
  isFullScreen: false,
  isMaximized: false,
};

const useWindowStat = () => {
  const [{ isMaximized, isFullScreen }, setWinStat] = useState(initialStat);
  const { getWindowStat } = window.electronAPI.window;

  useEffect(() => {
    getWindowStat().then((stat) => setWinStat(stat));

    const listener = (_: unknown, stat: typeof initialStat) => {
      setWinStat(stat);
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

export default useWindowStat;
