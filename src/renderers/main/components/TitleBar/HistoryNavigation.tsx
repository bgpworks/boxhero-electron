import React from "react";
import styled from "styled-components";

import useNavStat from "../../hooks/useNavStat";
import LeftArrow from "../svg-components/LeftArrow";
import Refresh from "../svg-components/Refresh";
import RightArrow from "../svg-components/RightArrow";
import NavButton from "./Buttons/NavButton";
import ButtonGroup from "./Containers/ButtonGroup";

const HistoryButtonGroup = styled(ButtonGroup)`
  left: calc(55px + 9%);
`;

const HistoryNavigation: React.FC = () => {
  const { canGoBack, canGoForward } = useNavStat();
  const { goBack, goForward, refresh } = window.electronAPI.history;

  return (
    <HistoryButtonGroup>
      <NavButton
        Icon={LeftArrow}
        onClick={goBack}
        isActive={canGoBack}
      />
      <NavButton
        Icon={RightArrow}
        onClick={goForward}
        isActive={canGoForward}
      />
      <NavButton
        Icon={Refresh}
        onClick={refresh}
      />
    </HistoryButtonGroup>
  );
};

export default HistoryNavigation;
