import { useEffect, useState } from "react";

const initialStat = {
  loading: false,
  initialized: false,
};

const useLoadingStat = () => {
  const [{ loading, initialized }, setState] = useState(initialStat);

  useEffect(() => {
    const handler = (_: unknown, loadingFromEvent: boolean) => {
      setState((prev) => ({
        loading: loadingFromEvent,
        initialized: prev.initialized || (prev.loading && !loadingFromEvent),
      }));
    };

    window.electronAPI.loading.onSyncLoading(handler);

    return () => {
      window.electronAPI.loading.offSyncLoading(handler);
    };
  }, [setState]);

  return {
    loading,
    initialized,
  };
};

export default useLoadingStat;
