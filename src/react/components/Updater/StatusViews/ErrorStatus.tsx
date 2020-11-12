import React from 'react';
import { useTranslation } from 'react-i18next';
import { updateMethods } from '../../../fromElectron';
import ErrorMessage from '../common/ErrorMessage';
import UpdateButton from '../UpdateButton';

const ErrorStatus: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <ErrorMessage>{t('update_msg_error')}</ErrorMessage>
      <UpdateButton onClick={updateMethods.checkUpdate}>
        {t('update_btn_check_again')}
      </UpdateButton>
    </>
  );
};

export default React.memo(ErrorStatus);
