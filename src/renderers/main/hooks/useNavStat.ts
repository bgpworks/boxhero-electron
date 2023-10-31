import { useEffect, useState } from "react";

const initialStat = {
  canGoBack: false,
  canGoForward: false,
};

const useNavStat = () => {
  const [{ canGoBack, canGoForward }, setNavState] = useState(initialStat);

  useEffect(() => {
    const listener = (_: unknown, stat: typeof initialStat) => {
      setNavState(stat);
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

export default useNavStat;
