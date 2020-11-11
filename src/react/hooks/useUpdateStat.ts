import { useState, useEffect } from 'react';
import type { UpdateInfo } from 'electron-updater';
import { ipcRenderer, setUpdateEvent, updateMethods } from '../fromElectron';

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

    const checkingForUpdateListener = setUpdateEvent(
      'checking-for-update',
      () => {
        initStat();
        setUpdateStat('checking-for-update');
      }
    );

    const updateAvailableListener = setUpdateEvent(
      'update-available',
      (updateInfo: UpdateInfo) => {
        setUpdateStat('update-available');
        setUpdateInfo(updateInfo);
      }
    );

    const updateNotAvailableListener = setUpdateEvent(
      'update-not-available',
      (updateInfo: UpdateInfo) => {
        setUpdateStat('update-not-available');
        setUpdateInfo(updateInfo);
      }
    );

    const updateDownloadedListener = setUpdateEvent(
      'update-downloaded',
      (updateInfo: UpdateInfo) => {
        setUpdateStat('update-downloaded');
        setUpdateInfo(updateInfo);
      }
    );

    const errorListener = setUpdateEvent('update-error', (error: Error) => {
      setUpdateStat('error');
      setUpdateError(error);
    });

    updateMethods
      .getCurrentVersion()
      .then((version) => setCurrentVersion(version));

    updateMethods.checkUpdate();

    return () => {
      ipcRenderer
        .off('checking-for-update', checkingForUpdateListener)
        .off('update-available', updateAvailableListener)
        .off('update-not-available', updateNotAvailableListener)
        .off('update-error', errorListener)
        .off('update-downloaded', updateDownloadedListener);
    };
  }, [setUpdateStat, setUpdateInfo, setUpdateError]);

  return { currentVersion, updateStat, updateInfo, updateError };
};
