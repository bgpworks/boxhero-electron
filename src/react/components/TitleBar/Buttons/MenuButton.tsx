import React from 'react';
import styled from 'styled-components';
import { viewNavigationMethods } from '../../../fromElectron';
import { clickableTitleArea } from '../styles/cssSnippets';
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
  const { openMainMenu } = viewNavigationMethods;

  return (
    <LeftButton onClick={openMainMenu}>
      <MenuBar color="#a0a4bb" />
    </LeftButton>
  );
};

export default MenuButton;
