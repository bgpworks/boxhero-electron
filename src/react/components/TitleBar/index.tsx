import React from 'react';
import styled from 'styled-components';
import { viewNavigationMethods } from '../../fromElectron';
import TitleBarContainer from './Containers/TitleBarContainer';
import TitleNavigation from './TitleNavigation';
import WindowOnlyNavigation from './WindowOnlyNavigation';

/*
윈도 환경에서 좌상단 우상단 포인트에서 크기 조절이 되려면,
일정 크기를 -webkit-app-region 을 no-drag 상태로 유지해야 함.
이를 위해 아래 스타일 코드에서는 상/좌우 영역에 5px씩의 공간의 여유를 만들었음.
*/
const DraggableBackground = styled.div`
  width: calc(100vw - 10px);
  height: 33px;

  color: white;
  text-align: center;
  line-height: 28px;

  -webkit-app-region: drag;
  user-select: none;

  position: absolute;
  left: 5px;
  top: 5px;

  z-index: 9998;
`;

const TitleBar: React.FC = () => {
  // const isWindow = window.BOXHERO_PLATFORM === 'win32';
  const isWindow = true;
  const { toggleMaximize } = viewNavigationMethods;

  return (
    <TitleBarContainer>
      <DraggableBackground onDoubleClick={toggleMaximize}>
        BoxHero
      </DraggableBackground>
      <TitleNavigation />
      {isWindow && <WindowOnlyNavigation />}
    </TitleBarContainer>
  );
};

export default TitleBar;
