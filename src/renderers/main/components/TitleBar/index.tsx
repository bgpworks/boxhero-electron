import React from "react";

import { isMac, isWindow } from "../../envs";
import MenuButton from "./Buttons/MenuButton";
import RestoreButton from "./Buttons/RestoreButton";
import Container from "./Container";
import NavigationControls from "./NavigationControls";
import WindowControls from "./WindowControls";

const TitleBar: React.FC = () => {
  return (
    <Container>
      {isWindow && <MenuButton />}
      <NavigationControls />
      {isWindow && <WindowControls />}
      {isMac && <RestoreButton />}
    </Container>
  );
};

export default TitleBar;
