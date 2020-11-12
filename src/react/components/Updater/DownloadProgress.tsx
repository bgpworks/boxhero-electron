import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { updateMethods } from '../../fromElectron';
import UpdateButton from './UpdateButton';

interface DownloadProgress {
  percent: number;
}

const DownloadProgress: React.FC<DownloadProgress> = ({ percent }) => {
  const { t } = useTranslation();

  return (
    <>
      <ProgressBarSection>
        <ProgressBar percent={percent} />
        <PercentText>{percent}%</PercentText>
      </ProgressBarSection>
      <UpdateButton onClick={updateMethods.cancelUpdate}>
        {t('update_btn_stop')}
      </UpdateButton>
    </>
  );
};

const ProgressBarSection = styled.div`
  width: 50%;
  margin: 10px 0 5px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PercentText = styled.div`
  margin-top: 5px;
  font-size: 12px;
`;

interface ProgressBarProps {
  percent: number;
}

const ProgressBar = styled.div<ProgressBarProps>`
  width: 100%;
  height: 5px;
  background-color: rgba(0, 0, 0, 0.2);

  border-radius: 4px;

  overflow: hidden;
  position: relative;

  &:after {
    content: '';
    position: absolute;

    top: 0;
    left: 0;

    background-color: #3b98fc;
    border: solid 0.5px #3585db;

    height: 5px;
    width: ${({ percent = 0 }) => percent}%;
  }
`;

export default React.memo(DownloadProgress);
