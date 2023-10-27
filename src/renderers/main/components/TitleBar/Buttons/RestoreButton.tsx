import React from "react";
import styled from "styled-components";

import { COLORS } from "../../../constants";
import useWindowStat from "../../../hooks/useWindowStat";
import { clickableTitleArea } from "../../../styles/cssSnippets";
import Unmaximize from "../../svg-components/Unmaximize";
import Button from "./Button";

const RightButton = styled(Button)`
  position: absolute;
  top: 50%;
  right: 20px;

  ${clickableTitleArea}

  transform: translate(0, -50%);
`;

const RestoreButton: React.FC = () => {
  const { isFullScreen } = useWindowStat();
  const { toggleMaximize } = window.electronAPI.window;

  if (!isFullScreen) return null;

  return (
    <RightButton onClick={toggleMaximize}>
      <Unmaximize
        color={COLORS.TITLEBAR_BTN}
        width="16px"
        height="16px"
      />
    </RightButton>
  );
};

export default React.memo(RestoreButton);
