import React from 'react';
import { SVGIconProps } from '../../svg-components/SVGIcon';
import Button from './Button';

interface NavButtonProps {
  Icon: React.FC<SVGIconProps>;
  isActive: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const NavButton: React.FC<NavButtonProps> = ({ Icon, onClick, isActive }) => {
  return (
    <Button onClick={onClick}>
      <Icon color="#a0a4bb" opacity={isActive ? 1 : 0.5} />
    </Button>
  );
};

export default React.memo(NavButton);
