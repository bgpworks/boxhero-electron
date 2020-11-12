import React from 'react';
import { UpdateInfo } from 'electron-differential-updater';
import { UpdateStat } from '../../hooks/useUpdateStat';
import ReadyStatus from './StatusViews/ReadyStatus';
import CheckingStatus from './StatusViews/CheckingStatus';
import ErrorStatus from './StatusViews/ErrorStatus';
import UpdateNotAvailableStatus from './StatusViews/UpdateNotAvailableStatus';
import UpdateAvailableStatus from './StatusViews/UpdateAvailableStatus';
import UpdateDownloadedStatus from './StatusViews/UpdateDownloadedStatus';

interface UpdateStatusProps {
  updateStat: UpdateStat;
  updateInfo?: UpdateInfo;
}

const UpdateStatus: React.FC<UpdateStatusProps> = ({
  updateStat,
  updateInfo,
}) => {
  return (
    <>
      {updateStat === 'ready' && <ReadyStatus />}
      {updateStat === 'update-not-available' && <UpdateNotAvailableStatus />}
      {updateStat === 'checking-for-update' && <CheckingStatus />}
      {updateStat === 'error' && <ErrorStatus />}
      {updateStat === 'update-available' && updateInfo && (
        <UpdateAvailableStatus version={updateInfo.version} />
      )}
      {updateStat === 'update-downloaded' && <UpdateDownloadedStatus />}
    </>
  );
};

export default React.memo(UpdateStatus);
