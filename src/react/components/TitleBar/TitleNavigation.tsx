import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { TitleBarNavStat } from '../../../@types/titlebar';
import { ipcRenderer } from '../../fromElectron';
import LeftArrow from '../svg-components/LeftArrow';
import Refresh from '../svg-components/Refresh';
import RightArrow from '../svg-components/RightArrow';
import NavButton from './Buttons/NavButton';
import ButtonGroup from './Containers/ButtonGroup';

const TitleNavigationButtonGroup = styled(ButtonGroup)`
  width: 88px;
  left: calc(55px + 9%);
`;

const initNavState: TitleBarNavStat = {
  canGoBack: false,
  canGoForward: false,
};

const TitleNavigation: React.FC = () => {
  const [{ canGoBack, canGoForward }, setNavState] = useState(initNavState);

  useEffect(() => {
    const listener = (_: any, newNavStat: TitleBarNavStat) => {
      setNavState(newNavStat);
    };

    ipcRenderer.on('sync-nav-stat', listener);

    return () => {
      ipcRenderer.off('sync-nav-stat', listener);
    };
  }, [setNavState]);

  const emitGoBack = useCallback(() => {
    ipcRenderer.invoke('history-go-back');
  }, []);

  const emitGoForward = useCallback(() => {
    ipcRenderer.invoke('history-go-forward');
  }, []);

  const emitRefresh = useCallback(() => {
    ipcRenderer.invoke('history-refresh');
  }, []);

  return (
    <TitleNavigationButtonGroup>
      <NavButton Icon={LeftArrow} onClick={emitGoBack} isActive={canGoBack} />
      <NavButton
        Icon={RightArrow}
        onClick={emitGoForward}
        isActive={canGoForward}
      />
      <NavButton Icon={Refresh} onClick={emitRefresh} isActive={true} />
    </TitleNavigationButtonGroup>
  );
};

export default TitleNavigation;
