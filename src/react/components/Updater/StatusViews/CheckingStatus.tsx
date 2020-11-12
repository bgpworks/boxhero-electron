import React from 'react';
import SingleMessage from '../common/SingleMessage';
import { useTranslation } from 'react-i18next';

const CheckingStatus: React.FC = () => {
  const { t } = useTranslation();
  return <SingleMessage>{t('update_msg_checking')}</SingleMessage>;
};

export default React.memo(CheckingStatus);
