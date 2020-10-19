import React from 'react';
import styled from 'styled-components';
import TitleButtonGroup from './TitleButtonGroup';
import WindowButtonGroup from './WindowButtonGroup';

const TitleBarContainer = styled.div`
  height: 38px;
  width: 100vw;

  background-color: #282c42;

  -webkit-app-region: drag;
  user-select: none;

  color: white;
  text-align: center;
  line-height: 38px;

  position: relative;
`;

const isWindow = process.platform === 'win32';

const TitleBar: React.FC = () => {
  return (
    <TitleBarContainer>
      <TitleButtonGroup />
      BoxHero
      {isWindow && <WindowButtonGroup />}
    </TitleBarContainer>
  );
};

export default TitleBar;
