import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background-color: transparent;
  border: none;
  padding: 0;

  width: 16px;
  height: 16px;

  outline: none;
`;

const TitleButton: React.FC = ({ children }) => {
  return <Button>{children}</Button>;
};

export default TitleButton;
