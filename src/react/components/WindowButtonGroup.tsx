import React from 'react';
import styled from 'styled-components';
import { ipcRenderer } from '../constants';
import Button from './Button';
import Close from './svg-components/Close';
import Maximize from './svg-components/Maximize';
import Menu from './svg-components/Menu';
import Minimize from './svg-components/Minimize';

const ButtonGroupContainer = styled.nav`
  width: 88px;
  height: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  position: absolute;
  top: 50%;
  right: 20px;

  transform: translate(0, -50%);
`;

const MenuButton = styled(Button)`
  position: absolute;
  top: 50%;
  left: 20px;

  transform: translate(0, -50%);
`;

const WindowButtonGroup: React.FC = () => {
  return (
    <>
      <MenuButton
        onClick={() => {
          ipcRenderer.send('open-main-menu');
        }}
      >
        <Menu color="#a0a4bb" />
      </MenuButton>
      <ButtonGroupContainer>
        <Button
          onClick={() => {
            ipcRenderer.send('minimize');
          }}
        >
          <Minimize color="#a0a4bb" />
        </Button>
        <Button
          onClick={() => {
            ipcRenderer.send('maximize');
          }}
        >
          <Maximize color="#a0a4bb" />
        </Button>
        <Button
          onClick={() => {
            ipcRenderer.send('close');
          }}
        >
          <Close color="#a0a4bb" />
        </Button>
      </ButtonGroupContainer>
    </>
  );
};

export default WindowButtonGroup;
