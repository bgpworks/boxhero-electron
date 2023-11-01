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

    window.electronAPI.navigation.onSyncNav(listener);

    return () => {
      window.electronAPI.navigation.offSyncNav(listener);
    };
  }, [setNavState]);

  return {
    canGoBack,
    canGoForward,
  };
};

export default useNavStat;
