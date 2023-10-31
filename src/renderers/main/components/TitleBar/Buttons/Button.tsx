import { css, styled } from "styled-components";

import { flexCenter } from "../../../styles/cssSnippets";

interface ButtonProps {
  disabled?: boolean;
}

const Button = styled.button<ButtonProps>`
  border: none;
  padding: 0;

  ${flexCenter}

  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: transparent;

  outline: none;
  transition: background-color 0.2s ease-in-out;

  ${({ disabled = false }) => !disabled && enableStyle};
`;

const enableStyle = css`
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export default Button;
