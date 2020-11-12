import React from 'react';
import styled from 'styled-components';

const UpdateButton = styled.button`
  min-width: 100px;
  font-size: 13px;
  text-align: center;
  color: #4f67ff;

  border: none;
  line-height: 16px;
  background-color: white;

  cursor: pointer;

  padding: 2px 0 1px;
  border-radius: 3px;
  box-shadow: 0 0.5px 1px 0 rgba(0, 0, 0, 0.27), 0 0 0 0.5px rgba(0, 0, 0, 0.1);
`;

export default React.memo(UpdateButton);
