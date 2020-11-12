import React from 'react';
import { useTranslation } from 'react-i18next';
import { updateMethods } from '../../../fromElectron';
import SingleMessage from '../common/SingleMessage';
import UpdateButton from '../UpdateButton';

const ReadyStatus: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <SingleMessage>{t('update_msg_ready')}</SingleMessage>
      <UpdateButton onClick={updateMethods.checkUpdate}>
        {t('update_btn_check_update')}
      </UpdateButton>
    </>
  );
};

export default React.memo(ReadyStatus);
