import type { UpdateInfo } from 'electron-updater';
import React from 'react';
import styled from 'styled-components';
import { updateMethods } from '../../fromElectron';
import { useUpdateProgress } from '../../hooks/useUpdateProgress';
import { useUpdateStat, UpdateStat } from '../../hooks/useUpdateStat';
import { useTranslation } from 'react-i18next';

const App: React.FC = () => {
  const { updateStat, currentVersion, updateInfo } = useUpdateStat();
  const progressObj = useUpdateProgress();

  return (
    <Container>
      <Logo src="../static/symbol.svg" alt="logo" />
      <AppName>BoxHero</AppName>
      <VersionText>Version {currentVersion}</VersionText>
      {progressObj && updateStat !== 'update-downloaded' ? (
        <UpdateProgress percent={progressObj.percent} />
      ) : (
        <UpdateStat updateStat={updateStat} updateInfo={updateInfo} />
      )}
      <Copyright>© BGPworks</Copyright>
    </Container>
  );
};

const ProgressContainer = styled.div`
  margin: 26px 0 12px;
  text-align: center;
`;

interface UpdateProgressProps {
  percent: number;
}

const UpdateProgress: React.FC<UpdateProgressProps> = ({ percent }) => {
  const { t } = useTranslation();

  return (
    <ProgressContainer>
      <ProgressBar percent={percent} />
      <UpdateButton
        onClick={() => {
          updateMethods.cancelDownload();
          updateMethods.checkUpdate();
        }}
      >
        {t('update_btn_stop')}
      </UpdateButton>
    </ProgressContainer>
  );
};

interface ProgressBarProps {
  percent: number;
}

const ProgressBar = styled.div<ProgressBarProps>`
  width: 150px;
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
    width: ${({ percent }) => (percent / 100) * 150}px;
  }
`;

interface UpdateStatProps {
  updateStat: UpdateStat;
  updateInfo?: UpdateInfo;
}

const UpdateStat: React.FC<UpdateStatProps> = ({ updateStat, updateInfo }) => {
  const { t } = useTranslation();

  return (
    <>
      {updateStat === 'ready' && (
        <SingleMessage>{t('update_msg_ready')}</SingleMessage>
      )}
      {updateStat === 'update-not-available' && (
        <SingleMessage>{t('update_msg_latest')}</SingleMessage>
      )}
      {updateStat === 'checking-for-update' && (
        <SingleMessage>{t('update_msg_checking')}</SingleMessage>
      )}
      {updateStat === 'error' && (
        <>
          <ErrorMessage>{t('update_msg_error')}</ErrorMessage>
          <UpdateButton onClick={updateMethods.checkUpdate}>
            {t('update_btn_check_again')}
          </UpdateButton>
        </>
      )}
      {updateStat === 'update-available' && updateInfo && (
        <>
          <SingleMessage>
            {t('update_msg_update_avaliable', {
              newVersion: updateInfo.version,
            })}
          </SingleMessage>
          <UpdateButton onClick={updateMethods.downloadUpdate}>
            {t('update_btn_start')}
          </UpdateButton>
        </>
      )}
      {updateStat === 'update-downloaded' && (
        <>
          <SingleMessage>{t('update_msg_done')}</SingleMessage>
          <UpdateButton onClick={updateMethods.quitAndInstall}>
            {t('update_btn_app_restart')}
          </UpdateButton>
        </>
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;
  height: 100%;

  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 20px 0 10px;
`;

const Logo = styled.img`
  width: 48px;
`;

const AppName = styled.h1`
  margin: 12px 0 0;
  font-size: 18px;
  font-weight: bold;

  line-height: 20px;
`;

const VersionText = styled.p`
  margin: 2px 0 0;
  font-size: 12px;

  line-height: 15px;
`;

const Copyright = styled.span`
  margin-top: auto;
  font-size: 10px;
  color: #4f67ff;
`;

const SingleMessage = styled.p`
  margin-top: 20px 0 0;
  font-size: 12px;
  line-height: 15px;
`;

const ErrorMessage = styled(SingleMessage)`
  color: red;
`;

const UpdateButton = styled.button`
  min-width: 100px;
  font-size: 13px;
  text-align: center;
  color: #4f67ff;

  border: none;
  line-height: 16px;
  background-color: white;

  cursor: pointer;

  padding: 2px 0 1px;
  border-radius: 3px;
  box-shadow: 0 0.5px 1px 0 rgba(0, 0, 0, 0.27), 0 0 0 0.5px rgba(0, 0, 0, 0.1);
`;

export default App;
