import React, { useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';
import styled from 'styled-components';
import { getMainView } from '../../fromElectron';

interface LoadingContainerProps {
  isLoading: boolean;
}

const LoadingContainer = styled.div<LoadingContainerProps>`
  display: ${({ isLoading = false }) => (isLoading ? 'flex' : 'none')};

  position: fixed;
  left: 50%;
  top: 50%;

  align-items: center;
  justify-content: center;

  padding: 40px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 15%;

  transform: translate(-50%, -50%);
`;

const LoadingIndicator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const webview = getMainView();
    if (!webview) return;

    webview.addEventListener('did-start-loading', () => setIsLoading(true));
    webview.addEventListener('did-stop-loading', () => setIsLoading(false));
  }, []);

  return (
    <LoadingContainer isLoading={isLoading}>
      <Loader type="Oval" color="black" height={80} width={80} />
    </LoadingContainer>
  );
};

export default LoadingIndicator;
