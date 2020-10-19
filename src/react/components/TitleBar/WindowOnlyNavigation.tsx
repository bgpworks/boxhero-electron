import React from 'react';
import styled from 'styled-components';
import Close from '../svg-components/Close';
import Maximize from '../svg-components/Maximize';
import Minimize from '../svg-components/Minimize';
import MenuButton from './Buttons/MenuButton';
import WindowNavButton from './Buttons/WindowNavButton';
import ButtonGroup from './Containers/ButtonGroup';

const WindowOnlyNavigationButtonGroup = styled(ButtonGroup)`
  width: 88px;
  right: 20px;
`;

const WindowOnlyNavigation: React.FC = () => {
  return (
    <>
      <MenuButton />
      <WindowOnlyNavigationButtonGroup>
        <WindowNavButton Icon={Minimize} eventName="minimize" />
        <WindowNavButton Icon={Maximize} eventName="maximize" />
        <WindowNavButton Icon={Close} eventName="close" />
      </WindowOnlyNavigationButtonGroup>
    </>
  );
};

export default WindowOnlyNavigation;
