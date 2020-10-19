import React from 'react';
import styled from 'styled-components';
import LeftArrow from '../svg-components/LeftArrow';
import RightArrow from '../svg-components/RightArrow';
import ReloadButton from './Buttons/ReloadButton';
import TitleButton from './Buttons/TitleButton';
import ButtonGroup from './Containers/ButtonGroup';

const TitleNavigationButtonGroup = styled(ButtonGroup)`
  width: 88px;
  left: calc(55px + 9%);
`;

const TitleNavigation: React.FC = () => {
  return (
    <TitleNavigationButtonGroup>
      <TitleButton
        Icon={LeftArrow}
        onClick={() => {
          const mainview = window.BOXHERO_MAIN_VIEW;
          mainview && mainview.goBack();
        }}
        statName="canGoBack"
      />
      <TitleButton
        Icon={RightArrow}
        onClick={() => {
          const mainview = window.BOXHERO_MAIN_VIEW;
          mainview && mainview.goForward();
        }}
        statName="canGoForward"
      />
      <ReloadButton />
    </TitleNavigationButtonGroup>
  );
};

export default TitleNavigation;
