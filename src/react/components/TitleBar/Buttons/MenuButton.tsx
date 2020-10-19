import React from 'react';
import styled from 'styled-components';
import { ipcRenderer } from '../../../constants';
import { clickableTitleArea } from '../../../styles/cssProps';
import MenuBar from '../../svg-components/MenuBar';
import Button from './Button';

const LeftButton = styled(Button)`
  position: absolute;
  top: 50%;
  left: 20px;

  ${clickableTitleArea}

  transform: translate(0, -50%);
`;

const MenuButton: React.FC = () => {
  return (
    <LeftButton
      onClick={() => {
        ipcRenderer.send('open-main-menu');
      }}
    >
      <MenuBar color="#a0a4bb" />
    </LeftButton>
  );
};

export default MenuButton;
