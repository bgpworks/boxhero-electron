import React from 'react';
import { useTranslation } from 'react-i18next';
import { updateMethods } from '../../../fromElectron';
import SingleMessage from '../common/SingleMessage';
import UpdateButton from '../UpdateButton';

interface UpdateAvailableStatusProps {
  version: string;
}

const UpdateAvailableStatus: React.FC<UpdateAvailableStatusProps> = ({
  version,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <SingleMessage>
        {t('update_msg_update_available', {
          newVersion: version,
        })}
      </SingleMessage>
      <UpdateButton onClick={updateMethods.downloadUpdate}>
        {t('update_btn_start')}
      </UpdateButton>
    </>
  );
};

export default React.memo(UpdateAvailableStatus);
