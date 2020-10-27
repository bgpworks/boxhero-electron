import React from 'react';
import ErrorPage from './components/ErrorPage/ErrorPage';
import LoadingIndicator from './components/LoadingIndicator';
import TitleBar from './components/TitleBar';

const App: React.FC = () => {
  return (
    <>
      <LoadingIndicator />
      <TitleBar />
      <ErrorPage />
    </>
  );
};

export default App;
