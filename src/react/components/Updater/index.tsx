import React from 'react';
import styled from 'styled-components';
import DownloadProgress from './DownloadProgress';
import UpdateStatus from './UpdateStatus';
import { mainMethods } from '../../fromElectron';
import { useUpdateProgress } from '../../hooks/useUpdateProgress';
import { useUpdateStat } from '../../hooks/useUpdateStat';

const Updater: React.FC = () => {
  const { updateStat, currentVersion, updateInfo } = useUpdateStat();
  const progressObj = useUpdateProgress();

  return (
    <Container>
      <Logo src="../static/symbol.svg" alt="logo" />
      <AppName>BoxHero</AppName>
      <VersionText>Version {currentVersion}</VersionText>
      {progressObj && updateStat !== 'update-downloaded' ? (
        <DownloadProgress percent={progressObj.percent} />
      ) : (
        <UpdateStatus updateStat={updateStat} updateInfo={updateInfo} />
      )}
      <Copyright
        onClick={() => mainMethods.openExternal('https://bgpworks.com/')}
      >
        © BGPworks
      </Copyright>
    </Container>
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

const Copyright = styled.a`
  margin-top: auto;
  font-size: 10px;
  color: #4f67ff;

  cursor: pointer;

  text-decoration: underline;
`;

export default Updater;
