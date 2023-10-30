import React from "react";
import styled from "styled-components";

import { COLORS } from "../../../constants";
import Menu from "../../../images/menu.svg?react";
import { canInteract } from "../../../styles/cssSnippets";
import Button from "./Button";

const LeftButton = styled(Button)`
  position: absolute;
  top: 50%;
  left: 20px;

  ${canInteract}

  transform: translate(0, -50%);
`;

const MenuButton: React.FC = () => {
  const { openMainMenu } = window.electronAPI.main;

  return (
    <LeftButton onClick={openMainMenu}>
      <Menu
        color={COLORS.TITLEBAR_BTN}
        width="16px"
        height="16px"
      />
    </LeftButton>
  );
};

export default React.memo(MenuButton);
