import React from "react";
import styled from "styled-components";

import useWindowStat from "../../hooks/useWindowStat";
import Close from "../svg-components/Close";
import Maximize from "../svg-components/Maximize";
import Minimize from "../svg-components/Minimize";
import Unmaximize from "../svg-components/Unmaximize";
import NavButton from "./Buttons/NavButton";
import ButtonGroup from "./Containers/ButtonGroup";

const WindowNavigationButtonGroup = styled(ButtonGroup)`
  right: 20px;
`;

const WindowNavigation: React.FC = () => {
  const { isFullScreen, isMaximized } = useWindowStat();
  const { toggleMaximize, minimize, close } = window.electronAPI.window;

  return (
    <WindowNavigationButtonGroup>
      <NavButton
        Icon={Minimize}
        onClick={minimize}
      />
      <NavButton
        Icon={isMaximized || isFullScreen ? Unmaximize : Maximize}
        onClick={toggleMaximize}
      />
      <NavButton
        Icon={Close}
        onClick={close}
      />
    </WindowNavigationButtonGroup>
  );
};

export default WindowNavigation;
