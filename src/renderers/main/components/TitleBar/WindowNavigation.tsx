import React from "react";
import styled from "styled-components";

import { COLORS } from "../../constants";
import useWindowStat from "../../hooks/useWindowStat";
import Close from "../../images/close.svg?react";
import Maximize from "../../images/maximize.svg?react";
import Minimize from "../../images/minimize.svg?react";
import Restore from "../../images/restore.svg?react";
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
        iconRenderer={(isActive) => (
          <Minimize
            color={COLORS.TITLEBAR_BTN}
            opacity={isActive ? 1 : 0.4}
            width="16px"
            height="16px"
          />
        )}
        onClick={minimize}
      />
      <NavButton
        iconRenderer={(isActive) => {
          const Icon = isMaximized || isFullScreen ? Restore : Maximize;

          return (
            <Icon
              color={COLORS.TITLEBAR_BTN}
              opacity={isActive ? 1 : 0.4}
              width="16px"
              height="16px"
            />
          );
        }}
        onClick={toggleMaximize}
      />
      <NavButton
        iconRenderer={(isActive) => (
          <Close
            color={COLORS.TITLEBAR_BTN}
            opacity={isActive ? 1 : 0.4}
            width="16px"
            height="16px"
          />
        )}
        onClick={close}
      />
    </WindowNavigationButtonGroup>
  );
};

export default WindowNavigation;
