import React from 'react';
import styled from 'styled-components';
import TitleButtonGroup from './TitleButtonGroup';
import WindowButtonGroup from './WindowButtonGroup';

const TitleBarContainer = styled.div`
  height: 38px;
  width: 100vw;

  position: relative;
`;

const TitleBarBackground = styled.div`
  width: 100vw;
  height: 38px;
  background-color: #282c42;

  color: white;
  text-align: center;
  line-height: 38px;

  -webkit-app-region: drag;
  user-select: none;

  position: absolute;
  left: 0;
  top: 0;

  z-index: 9998;
`;

const TitleBar: React.FC = () => {
  const isWindow = window.BOXHERO_PLATFORM === 'win32';

  return (
    <TitleBarContainer>
      <TitleBarBackground>BoxHero</TitleBarBackground>
      <TitleButtonGroup />
      {isWindow && <WindowButtonGroup />}
    </TitleBarContainer>
  );
};

export default TitleBar;
