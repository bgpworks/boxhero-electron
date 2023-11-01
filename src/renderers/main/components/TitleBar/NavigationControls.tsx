import React from "react";
import { styled } from "styled-components";

import { COLORS } from "../../constants";
import useNavStat from "../../hooks/useNavStat";
import Back from "../../images/back.svg?react";
import Forward from "../../images/forward.svg?react";
import Reload from "../../images/reload.svg?react";
import ButtonGroup from "./ButtonGroup";
import NavButton from "./Buttons/NavButton";

const PositionedButtonGroup = styled(ButtonGroup)`
  left: calc(55px + 9%);
`;

const NavigationControls: React.FC = () => {
  const { canGoBack, canGoForward } = useNavStat();
  const { goBack, goForward, reload } = window.electronAPI.navigation;

  return (
    <PositionedButtonGroup>
      <NavButton
        iconRenderer={(isActive) => (
          <Back
            color={COLORS.TITLEBAR_BTN}
            opacity={isActive ? 1 : 0.4}
            width="16px"
            height="16px"
          />
        )}
        onClick={goBack}
        isActive={canGoBack}
      />
      <NavButton
        iconRenderer={(isActive) => (
          <Forward
            color={COLORS.TITLEBAR_BTN}
            opacity={isActive ? 1 : 0.4}
            width="16px"
            height="16px"
          />
        )}
        onClick={goForward}
        isActive={canGoForward}
      />
      <NavButton
        iconRenderer={(isActive) => (
          <Reload
            color={COLORS.TITLEBAR_BTN}
            opacity={isActive ? 1 : 0.4}
            width="16px"
            height="16px"
          />
        )}
        onClick={reload}
      />
    </PositionedButtonGroup>
  );
};

export default NavigationControls;
