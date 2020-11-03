import React from 'react';
import { COLORS } from '../../../constants';
import { SVGIconProps } from '../../svg-components/SVGIcon';
import Button from './Button';

interface NavButtonProps {
  Icon: React.FC<SVGIconProps>;
  isActive?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const NavButton: React.FC<NavButtonProps> = ({
  Icon,
  onClick,
  isActive = true,
}) => {
  return (
    <Button onClick={onClick}>
      <Icon
        color={COLORS.TITLEBAR_BTN}
        opacity={isActive ? 1 : 0.4}
        width="16px"
        height="16px"
      />
    </Button>
  );
};

export default React.memo(NavButton);
