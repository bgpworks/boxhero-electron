import { styled } from "styled-components";

import { canInteract } from "../../styles/cssSnippets";

const ButtonGroup = styled.nav`
  height: 100%;

  display: inline-flex;
  gap: 12px;
  align-items: center;

  position: absolute;
  top: 50%;

  ${canInteract}

  transform: translate(0, -50%);
`;

export default ButtonGroup;
