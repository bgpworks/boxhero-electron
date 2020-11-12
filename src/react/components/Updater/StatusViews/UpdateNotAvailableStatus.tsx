import React from 'react';
import { useTranslation } from 'react-i18next';
import SingleMessage from '../common/SingleMessage';

const ErrorStatus: React.FC = () => {
  const { t } = useTranslation();

  return <SingleMessage>{t('update_msg_latest')}</SingleMessage>;
};

export default React.memo(ErrorStatus);
