import React from 'react';
import { useTranslation } from 'react-i18next';
import { updateMethods } from '../../../fromElectron';
import SingleMessage from '../common/SingleMessage';
import UpdateButton from '../UpdateButton';

const UpdateDownloadedStatus: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <SingleMessage>{t('update_msg_done')}</SingleMessage>
      <UpdateButton onClick={updateMethods.quitAndInstall}>
        {t('update_btn_app_restart')}
      </UpdateButton>
    </>
  );
};

export default React.memo(UpdateDownloadedStatus);
