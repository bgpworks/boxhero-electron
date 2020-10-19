import React from 'react';
import styled from 'styled-components';
import TitleButtonGroup from './TitleButtonGroup';

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

const TitleBar: React.FC = () => {
  return (
    <TitleBarContainer>
      <TitleButtonGroup />
      BoxHero
    </TitleBarContainer>
  );
};

export default TitleBar;
