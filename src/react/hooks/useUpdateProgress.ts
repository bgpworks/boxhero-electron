import { useState, useEffect } from 'react';
import { IProgressObject } from '../../@types/update';
import { ipcRenderer } from '../fromElectron';

export const useUpdateProgress = () => {
  const [progressStat, setProgressStat] = useState<IProgressObject>();

  useEffect(() => {
    const listener = (_: unknown, progressStat: IProgressObject) => {
      setProgressStat(progressStat);
    };

    ipcRenderer.on('download-progress', listener);

    return () => {
      ipcRenderer.off('download-progress', listener);
    };
  }, [setProgressStat]);

  return progressStat;
};
