import { styled } from "styled-components";

import { canInteract } from "../../styles/cssSnippets";

const ButtonGroup = styled.nav`
  height: 100%;
  width: 96px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  position: absolute;
  top: 50%;

  ${canInteract}

  transform: translate(0, -50%);
`;

export default ButtonGroup;
