import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../../constants';
import { mainMethods } from '../../../fromElectron';
import { clickableTitleArea } from '../../../styles/cssSnippets';
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
  const { openMainMenu } = mainMethods;

  return (
    <LeftButton onClick={openMainMenu}>
      <MenuBar color={COLORS.TITLEBAR_BTN} width="16px" height="16px" />
    </LeftButton>
  );
};

export default MenuButton;
