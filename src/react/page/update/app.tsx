import type { UpdateInfo } from 'electron-updater';
import React from 'react';
import styled from 'styled-components';
import { updateMethods } from '../../fromElectron';
import { useUpdateProgress } from '../../hooks/useUpdateProgress';
import { useUpdateStat, UpdateStat } from '../../hooks/useUpdateStat';

const App: React.FC = () => {
  const { updateStat, currentVersion, updateInfo } = useUpdateStat();
  const progressObj = useUpdateProgress();

  return (
    <Container>
      <Logo src="../static/symbol.svg" alt="logo" />
      <AppName>BoxHero</AppName>
      <VersionText>Version {currentVersion}</VersionText>
      {progressObj ? (
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
  return (
    <ProgressContainer>
      <ProgressBar percent={percent} />
      <UpdateButton onClick={updateMethods.cancelDownload}>
        업데이트 중지
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
  return (
    <>
      {updateStat === 'ready' && <SingleMessage>준비중</SingleMessage>}
      {updateStat === 'update-not-avaliable' && (
        <SingleMessage>최신 버전을 사용하고 있습니다.</SingleMessage>
      )}
      {updateStat === 'checking-for-update' && (
        <SingleMessage>업데이트 확인중..</SingleMessage>
      )}
      {updateStat === 'error' && (
        <>
          <ErrorMessage>오류가 발생하였습니다.</ErrorMessage>
          <UpdateButton onClick={updateMethods.checkUpdate}>
            재확인
          </UpdateButton>
        </>
      )}
      {updateStat === 'update-avaliable' && updateInfo && (
        <>
          <SingleMessage>
            최신버전({updateInfo.version})으로 업데이트가 필요합니다.
          </SingleMessage>
          <UpdateButton onClick={updateMethods.downloadUpdate}>
            업데이트
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
