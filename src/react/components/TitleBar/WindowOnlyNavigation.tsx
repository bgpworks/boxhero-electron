import React from 'react';
import styled from 'styled-components';
import { viewNavigationMethods } from '../../fromElectron';
import Close from '../svg-components/Close';
import Maximize from '../svg-components/Maximize';
import Minimize from '../svg-components/Minimize';
import MenuButton from './Buttons/MenuButton';
import NavButton from './Buttons/NavButton';
import ButtonGroup from './Containers/ButtonGroup';

const WindowOnlyNavigationButtonGroup = styled(ButtonGroup)`
  width: 88px;
  right: 20px;
`;

const WindowOnlyNavigation: React.FC = () => {
  const { maximize, minimize, close } = viewNavigationMethods;
  return (
    <>
      <MenuButton />
      <WindowOnlyNavigationButtonGroup>
        <NavButton Icon={Minimize} onClick={minimize} />
        <NavButton Icon={Maximize} onClick={maximize} />
        <NavButton Icon={Close} onClick={close} />
      </WindowOnlyNavigationButtonGroup>
    </>
  );
};

export default WindowOnlyNavigation;
