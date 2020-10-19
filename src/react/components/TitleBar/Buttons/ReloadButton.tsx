import React from 'react';
import Refresh from '../../svg-components/Refresh';
import Button from './Button';

const ReloadButton: React.FC = () => {
  return (
    <Button
      onClick={() => {
        const mainview = window.BOXHERO_MAIN_VIEW;
        mainview && mainview.reload();
      }}
    >
      <Refresh color="#a0a4bb" />
    </Button>
  );
};

export default ReloadButton;
