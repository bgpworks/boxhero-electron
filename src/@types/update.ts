import type { UpdateInfo } from 'electron-updater';

export interface IProgressObject {
  bytesPerSecond: number;
  percent: number;
  transferred: number;
  total: number;
  canceled: boolean;
}

export interface UpdateEventPair {
  'checking-for-update': null;
  'update-cancelled': null;
  'update-available': UpdateInfo;
  'update-not-available': UpdateInfo;
  'update-error': Error;
  'update-downloaded': UpdateInfo;
  'download-progress': IProgressObject;
}
