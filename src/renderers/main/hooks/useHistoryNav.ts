import { useState, useEffect } from "react";
import { TitleBarNavStat } from "../../../types/titlebar";

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

    window.electronAPI.history.onSyncNav(listener);

    return () => {
      window.electronAPI.history.offSyncNav(listener);
    };
  }, [setNavState]);

  return {
    canGoBack,
    canGoForward,
  };
};
