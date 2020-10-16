import React from 'react';
import SVGIcon, { SVGIconProps } from './SVGIcon';

const RightArrow: React.FC<SVGIconProps> = ({ color, opacity }) => {
  return (
    <SVGIcon color={color} opacity={opacity}>
      <path d="M1.75 8.742h10.432L8.22 12.704a.749.749 0 101.06 1.06l5.242-5.242a.749.749 0 000-1.06L9.28 2.22C9.134 2.073 8.942 2 8.75 2s-.384.073-.53.22a.749.749 0 000 1.06l3.962 3.962H1.75a.75.75 0 000 1.5" />
    </SVGIcon>
  );
};

export default RightArrow;
