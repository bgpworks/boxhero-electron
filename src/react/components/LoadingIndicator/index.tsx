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

  z-index: 9999;
`;

const LoadingIndicator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const webview = getMainView();
    if (!webview) return;

    const setLoadingTrue = () => setIsLoading(true);
    const setLoadingFalse = () => setIsLoading(false);

    webview.addEventListener('did-start-loading', setLoadingTrue);
    webview.addEventListener('did-stop-loading', setLoadingFalse);
    webview.addEventListener('dom-ready', () => setLoadingFalse);

    return () => {
      webview.removeEventListener('did-start-loading', setLoadingTrue);
      webview.removeEventListener('did-stop-loading', setLoadingFalse);
      webview.removeEventListener('dom-ready', setLoadingFalse);
    };
  }, []);

  return (
    <LoadingContainer isLoading={isLoading}>
      <Loader type="Oval" color="black" height={80} width={80} />
    </LoadingContainer>
  );
};

export default LoadingIndicator;
