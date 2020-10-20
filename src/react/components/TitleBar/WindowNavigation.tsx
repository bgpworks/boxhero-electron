import React from 'react';
import styled from 'styled-components';
import { windowMethods } from '../../fromElectron';
import { useWindowNav } from '../../hooks/useWindowNav';
import Close from '../svg-components/Close';
import Maximize from '../svg-components/Maximize';
import Minimize from '../svg-components/Minimize';
import Unmaximize from '../svg-components/Unmaximize';
import MenuButton from './Buttons/MenuButton';
import NavButton from './Buttons/NavButton';
import ButtonGroup from './Containers/ButtonGroup';

const WindowNavigationButtonGroup = styled(ButtonGroup)`
  right: 20px;
`;

const WindowNavigation: React.FC = () => {
  const { isFullScreen, isMaximized } = useWindowNav();
  const { toggleMaximize, minimize, close } = windowMethods;

  return (
    <>
      <MenuButton />
      <WindowNavigationButtonGroup>
        <NavButton Icon={Minimize} onClick={minimize} />
        <NavButton
          Icon={isMaximized || isFullScreen ? Unmaximize : Maximize}
          onClick={toggleMaximize}
        />
        <NavButton Icon={Close} onClick={close} />
      </WindowNavigationButtonGroup>
    </>
  );
};

export default WindowNavigation;
