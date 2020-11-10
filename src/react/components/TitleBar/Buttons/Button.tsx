import styled from 'styled-components';
import { flexCenter } from '../../../styles/cssSnippets';

const Button = styled.button`
  border: none;
  padding: 0;

  ${flexCenter}

  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: transparent;

  outline: none;
  cursor: pointer;

  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export default Button;
