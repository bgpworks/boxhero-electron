import { useState, useEffect } from 'react';
import type { UpdateInfo } from 'electron-updater';
import { ipcRenderer, updateMethods } from '../fromElectron';

export type UpdateStat =
  | 'ready'
  | 'checking-for-update'
  | 'update-available'
  | 'update-not-available'
  | 'update-downloaded'
  | 'error';

export const useUpdateStat = () => {
  const [currentVersion, setCurrentVersion] = useState('');
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
      setUpdateStat('update-available');
      setUpdateInfo(updateInfo);
    };

    const updateNotAvaliableListener = (_: unknown, updateInfo: UpdateInfo) => {
      setUpdateStat('update-not-available');
      setUpdateInfo(updateInfo);
    };

    const updateDownloadedListener = (_: unknown, updateInfo: UpdateInfo) => {
      setUpdateStat('update-downloaded');
      setUpdateInfo(updateInfo);
    };

    const errorListener = (_: unknown, error: Error) => {
      setUpdateStat('error');
      setUpdateError(error);
    };

    ipcRenderer
      .on('checking-for-update', checkingForUpdateListener)
      .on('update-available', updateAvaliableListener)
      .on('update-not-available', updateNotAvaliableListener)
      .on('update-error', errorListener)
      .on('update-downloaded', updateDownloadedListener);

    updateMethods
      .getCurrentVersion()
      .then((version) => setCurrentVersion(version));

    updateMethods.checkUpdate();

    return () => {
      ipcRenderer
        .off('checking-for-update', checkingForUpdateListener)
        .off('update-available', updateAvaliableListener)
        .off('update-not-available', updateNotAvaliableListener)
        .off('update-error', errorListener)
        .off('update-downloaded', updateDownloadedListener);
    };
  }, [setUpdateStat, setUpdateInfo, setUpdateError]);

  return { currentVersion, updateStat, updateInfo, updateError };
};