import { useState, useEffect } from 'react';
import { IProgressObject } from '../../@types/update';
import { ipcRenderer, updateMethods } from '../fromElectron';

export const useDownloadProgress = () => {
  const [progressStat, setProgressStat] = useState<IProgressObject>();

  useEffect(() => {
    const listener = (_: unknown, progressStat: IProgressObject) => {
      setProgressStat(progressStat);
    };

    const cancelListener = () => {
      setProgressStat(undefined);
      updateMethods.checkUpdate();
    };

    ipcRenderer
      .on('download-progress', listener)
      .on('update-cancelled', cancelListener);

    return () => {
      ipcRenderer
        .off('download-progress', listener)
        .off('update-cancelled', cancelListener);
    };
  }, [setProgressStat]);

  return progressStat;
};
