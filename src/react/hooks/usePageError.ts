import { useState, useEffect } from 'react';
import { getMainView } from '../fromElectron';

interface ErrorState {
  errorCode?: number;
  errorDescription?: string;
}

export const usePageError = () => {
  const [{ errorCode, errorDescription }, setErrorState] = useState<ErrorState>(
    {}
  );

  useEffect(() => {
    const mainView = getMainView();
    if (!mainView) return;

    mainView.addEventListener('did-start-loading', () => setErrorState({}));
    mainView.addEventListener('did-fail-load', (e) => {
      const { errorCode, errorDescription } = e;
      setErrorState({ errorCode, errorDescription });
    });
  }, [setErrorState]);

  return { errorCode, errorDescription };
};
