import styled from 'styled-components';
import { clickableTitleArea } from '../styles/cssSnippets';

const ButtonGroup = styled.nav`
  height: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  position: absolute;
  top: 50%;

  ${clickableTitleArea}

  transform: translate(0, -50%);
`;

export default ButtonGroup;
