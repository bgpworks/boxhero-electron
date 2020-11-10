import { autoUpdater, UpdateInfo, CancellationToken } from 'electron-updater';
import log from 'electron-log';
import { isDev } from '../envs';
import { setMainIPC } from './utils';
import { getViewState } from '../utils/manageViewState';
import { IProgressObject } from '../../@types/update';

export const initUpdateIPC = () => {
  // if (isDev) return;

  // 오토 업데이터의 로그를 electron.log가 담당하도록 설정.
  autoUpdater.logger = log;

  let cancelToken: CancellationToken;

  setMainIPC
    .handle('check-for-update', () => {
      autoUpdater.checkForUpdates();
    })
    .handle('get-current-version', () => autoUpdater.currentVersion.version)
    .handle('download-update', () => {
      cancelToken = new CancellationToken();
      autoUpdater.downloadUpdate(cancelToken);
    })
    .handle('cancel-download', () => {
      if (cancelToken) {
        cancelToken.cancel();
      }
    });

  autoUpdater.on('checking-for-update', () => {
    const { updateWindow } = getViewState();
    if (!updateWindow) return;

    updateWindow.webContents.send('checking-for-update');
  });

  // 업데이트가 가능할때 발생하는 이벤트.
  autoUpdater.on('update-avaliable', (info: UpdateInfo) => {
    const { updateWindow } = getViewState();
    if (!updateWindow) return;

    updateWindow.webContents.send('update-avaliable', info);
  });

  // 업데이트가 없을 때
  autoUpdater.on('update-not-avaliable', (info: UpdateInfo) => {
    const { updateWindow } = getViewState();
    if (!updateWindow) return;

    updateWindow.webContents.send('update-not-avaliable', info);
  });

  // 알 수 없는 에러 발생
  autoUpdater.on('error', (error: Error) => {
    const { updateWindow } = getViewState();
    if (!updateWindow) return;

    updateWindow.webContents.send('update-error', error);
  });

  autoUpdater.on('download-progress', (progressObj: IProgressObject) => {
    const { updateWindow } = getViewState();
    if (!updateWindow) return;

    updateWindow.webContents.send('download-progress', progressObj);
  });

  autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
    const { updateWindow } = getViewState();
    if (!updateWindow) return;

    updateWindow.webContents.send('update-downloaded', info);
  });

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.checkForUpdates();
};
