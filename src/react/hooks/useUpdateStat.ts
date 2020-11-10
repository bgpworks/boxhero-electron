import { useState, useEffect } from 'react';
import type { UpdateInfo } from 'electron-updater';
import { ipcRenderer } from '../fromElectron';

type UpdateStat =
  | 'ready'
  | 'checking-for-update'
  | 'update-avaliable'
  | 'update-not-avaliable'
  | 'error';

export const useUpdateStat = () => {
  const [updateStat, setUpdateStat] = useState<UpdateStat>('ready');
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>();
  const [updateError, setUpdateError] = useState<Error>();

  useEffect(() => {
    const initStat = () => {
      setUpdateInfo(undefined);
      setUpdateError(undefined);
    };

    const checkingForUpdateListener = () => {
      initStat();
      setUpdateStat('checking-for-update');
    };

    const updateAvaliableListener = (_: unknown, updateInfo: UpdateInfo) => {
      setUpdateStat('update-avaliable');
      setUpdateInfo(updateInfo);
    };

    const updateNotAvaliableListener = (_: unknown, updateInfo: UpdateInfo) => {
      setUpdateStat('update-not-avaliable');
      setUpdateInfo(updateInfo);
    };

    const errorListener = (_: unknown, error: Error) => {
      setUpdateStat('error');
      setUpdateError(error);
    };

    ipcRenderer
      .on('checking-for-update', checkingForUpdateListener)
      .on('update-avaliable', updateAvaliableListener)
      .on('update-not-avaliable', updateNotAvaliableListener)
      .on('update-error', errorListener);

    return () => {
      ipcRenderer
        .off('checking-for-update', checkingForUpdateListener)
        .off('update-avaliable', updateAvaliableListener)
        .off('update-not-avaliable', updateNotAvaliableListener)
        .off('update-error', errorListener);
    };
  }, [setUpdateStat, setUpdateInfo, setUpdateError]);

  return { updateStat, updateInfo, updateError };
};
