import { useEffect, useState } from "react";

const initContentsState = {
  loading: false,
  initialized: false,
};

export const useContents = () => {
  const [{ loading, initialized }, setState] = useState(initContentsState);

  useEffect(() => {
    const startListener = () => {
      setState((prev) => {
        return { ...prev, loading: true };
      });
    };

    const stopListener = () => {
      setState({ loading: false, initialized: true });
    };

    window.electronAPI.contents.onStartLoading(startListener);
    window.electronAPI.contents.onStopLoading(stopListener);

    return () => {
      window.electronAPI.contents.offStartLoading(startListener);
      window.electronAPI.contents.offStopLoading(stopListener);
    };
  }, [setState]);

  return {
    loading,
    initialized,
  };
};
