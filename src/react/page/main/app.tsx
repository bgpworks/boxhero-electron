import React from 'react';
import LoadingIndicator from '../../components/LoadingIndicator';
import TitleBar from '../../components/TitleBar';

const App: React.FC = () => {
  return (
    <>
      <LoadingIndicator />
      <TitleBar />
    </>
  );
};

export default App;
