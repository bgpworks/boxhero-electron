import React from 'react';
import SVGIcon, { SVGIconProps } from './SVGIcon';

const Menu: React.FC<SVGIconProps> = ({ color, opacity }) => {
  return (
    <SVGIcon color={color} opacity={opacity}>
      <path d="M13.75 4.5h-12c-.414 0-.75-.336-.75-.75S1.336 3 1.75 3h12c.414 0 .75.336.75.75s-.336.75-.75.75zm0 4h-12c-.414 0-.75-.336-.75-.75S1.336 7 1.75 7h12c.414 0 .75.336.75.75s-.336.75-.75.75zm0 4h-12c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h12c.414 0 .75.336.75.75s-.336.75-.75.75z" />
    </SVGIcon>
  );
};

export default Menu;
