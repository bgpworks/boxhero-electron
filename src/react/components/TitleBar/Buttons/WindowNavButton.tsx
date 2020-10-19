import React from 'react';
import { ipcRenderer } from '../../../constants';
import { SVGIconProps } from '../../svg-components/SVGIcon';
import { BUTTON_COLOR } from '../constants';
import Button from './Button';

interface WindowNavButtonProps {
  Icon: React.FC<SVGIconProps>;
  eventName: string;
}

const WindowNavButton: React.FC<WindowNavButtonProps> = ({
  eventName,
  Icon,
}) => {
  return (
    <Button
      onClick={() => {
        ipcRenderer.send(eventName);
      }}
    >
      <Icon color={BUTTON_COLOR} />
    </Button>
  );
};

export default WindowNavButton;
