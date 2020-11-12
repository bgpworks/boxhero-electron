import React from 'react';
import { useTranslation } from 'react-i18next';
import SingleMessage from './SingleMessage';

const CheckingStatus: React.FC = () => {
  const { t } = useTranslation();
  return <SingleMessage>{t('update_msg_checking')}</SingleMessage>;
};

export default React.memo(CheckingStatus);
