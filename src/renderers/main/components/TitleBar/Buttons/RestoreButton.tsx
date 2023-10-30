import React from "react";
import styled from "styled-components";

import { COLORS } from "../../../constants";
import useWindowStat from "../../../hooks/useWindowStat";
import Restore from "../../../images/restore.svg?react";
import { canInteract } from "../../../styles/cssSnippets";
import Button from "./Button";

const RightButton = styled(Button)`
  position: absolute;
  top: 50%;
  right: 20px;

  ${canInteract}

  transform: translate(0, -50%);
`;

const RestoreButton: React.FC = () => {
  const { isFullScreen } = useWindowStat();
  const { toggleMaximize } = window.electronAPI.window;

  if (!isFullScreen) return null;

  return (
    <RightButton onClick={toggleMaximize}>
      <Restore
        color={COLORS.TITLEBAR_BTN}
        width="16px"
        height="16px"
      />
    </RightButton>
  );
};

export default React.memo(RestoreButton);
