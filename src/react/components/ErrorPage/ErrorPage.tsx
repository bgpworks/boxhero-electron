import React from 'react';
import styled from 'styled-components';
import { TITLEBAR_HEIGHT } from '../../constants';
import { usePageError } from '../../hooks/usePageError';

const ErrorPage: React.FC = () => {
  const { errorCode, errorDescription } = usePageError();

  if (!errorCode) return null;

  return (
    <ErrorContainer>
      <h1>{errorDescription}</h1>
      ErrorCode : {errorCode}
    </ErrorContainer>
  );
};

const ErrorContainer = styled.section`
  width: 100vw;
  height: calc(100vh - ${TITLEBAR_HEIGHT});

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-weight: bold;
  color: red;
`;

export default ErrorPage;
