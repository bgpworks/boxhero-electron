import { useEffect, useState } from "react";

const initialStat = {
  loading: false,
  initialized: false,
};

const useLoadingStat = () => {
  const [{ loading, initialized }, setState] = useState(initialStat);

  useEffect(() => {
    const startListener = () => {
      setState((prev) => {
        return { ...prev, loading: true };
      });
    };

    const stopListener = () => {
      setState({ loading: false, initialized: true });
    };

    window.electronAPI.loading.onStartLoading(startListener);
    window.electronAPI.loading.onStopLoading(stopListener);

    return () => {
      window.electronAPI.loading.offStartLoading(startListener);
      window.electronAPI.loading.offStopLoading(stopListener);
    };
  }, [setState]);

  return {
    loading,
    initialized,
  };
};

export default useLoadingStat;
