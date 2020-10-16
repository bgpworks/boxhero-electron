import React from 'react';
import SVGIcon, { SVGIconProps } from './SVGIcon';

const LeftArrow: React.FC<SVGIconProps> = ({ color = 'white' }) => {
  return (
    <SVGIcon color={color}>
      <path d="M13.992 7.242H3.56L7.522 3.28a.749.749 0 10-1.06-1.06L1.22 7.462a.749.749 0 000 1.06l5.242 5.242c.146.147.338.22.53.22s.384-.073.53-.22a.749.749 0 000-1.06L3.56 8.742h10.432a.75.75 0 000-1.5" />
    </SVGIcon>
  );
};

export default LeftArrow;
