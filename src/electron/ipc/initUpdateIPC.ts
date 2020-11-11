import { autoUpdater, UpdateInfo, CancellationToken } from 'electron-updater';
import log from 'electron-log';
import { isDev } from '../envs';
import { setMainIPC } from './utils';
import { getViewState } from '../utils/manageViewState';
import { IProgressObject, UpdateEventPair } from '../../@types/update';
import { openUpdateWindow } from '../window';
import { BrowserWindow } from 'electron';

function getUpdateChannel(version: string) {
  if (version == null) {
    return 'latest';
  }

  const result = /-(alpha|beta)$/.exec(version);
  if (result != null && result.length == 2) {
    return result[1];
  } else {
    return 'latest';
  }
}

function initUpdateChannel(version: string) {
  const channel = getUpdateChannel(version);
  log.log('Update channel:', channel);
  autoUpdater.channel = channel;
}

// 타입 안전을 지키면서 이벤트를 보냄.
const sendUpdateEvent = <T extends keyof UpdateEventPair>(
  eventName: T,
  arg: UpdateEventPair[T]
) => {
  const { updateWindow } = getViewState();

  if (!updateWindow) {
    const newUpdateWindow = openUpdateWindow();

    if (!newUpdateWindow) return;

    newUpdateWindow.webContents.once('did-finish-load', () => {
      newUpdateWindow.webContents.send(eventName, arg);
    });

    return;
  }

  updateWindow.webContents.send(eventName, arg);
};

export const initUpdateIPC = (appVersion: string) => {
  if (isDev) return;

  // 오토 업데이터의 로그를 electron.log가 담당하도록 설정.
  autoUpdater.logger = log;

  // 버전명에 따라 업데이트 채널을 alpha | beta | latest로 설정한다.
  initUpdateChannel(appVersion);

  let cancelToken: CancellationToken | undefined;

  setMainIPC
    .handle('check-for-update', () => {
      autoUpdater.checkForUpdates();
    })
    .handle('get-current-version', () => autoUpdater.currentVersion.version)
    .handle('download-update', () => {
      cancelToken = new CancellationToken();
      autoUpdater.downloadUpdate(cancelToken);
    })
    .handle('cancel-update', () => {
      if (cancelToken) {
        cancelToken.cancel();
      }
    })
    .handle('quit-and-install', () => {
      autoUpdater.quitAndInstall();
    });

  autoUpdater
    .on('checking-for-update', () => {
      sendUpdateEvent('checking-for-update', null);
    })
    .on('update-cancelled', () => {
      sendUpdateEvent('update-cancelled', null);
      cancelToken = undefined;
    })
    .on('update-available', (info: UpdateInfo) => {
      sendUpdateEvent('update-available', info);
    })
    .on('update-not-available', (info: UpdateInfo) => {
      sendUpdateEvent('update-not-available', info);
    })
    .on('error', (error: Error) => {
      sendUpdateEvent('update-error', error);
    })
    .on('download-progress', (progressObj: IProgressObject) => {
      sendUpdateEvent('download-progress', progressObj);
    })
    .on('update-downloaded', (info: UpdateInfo) => {
      sendUpdateEvent('update-downloaded', info);
    })
    .checkForUpdatesAndNotify()
    .then((checkResult) => {
      if (checkResult) {
        cancelToken = checkResult.cancellationToken;
      }
    });
};
