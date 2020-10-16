import React from 'react';
import styled from 'styled-components';

const TitleBarContainer = styled.div`
  height: 38px;
  width: 100vw;

  background-color: #282c42;

  -webkit-app-region: drag;
  user-select: none;
`;

const TitleBar: React.FC = () => {
  return <TitleBarContainer>ffddfdd</TitleBarContainer>;
};

export default TitleBar;
