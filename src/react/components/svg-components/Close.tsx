import React from 'react';
import SVGIcon, { SVGIconProps } from './SVGIcon';

const Close: React.FC<SVGIconProps> = ({ color, opacity }) => {
  return (
    <SVGIcon color={color} opacity={opacity}>
      <path d="M9.139 8.078l4.798-4.798c.293-.293.293-.767 0-1.06-.293-.293-.768-.293-1.061 0L8.078 7.017 3.28 2.22c-.293-.293-.768-.293-1.061 0-.293.293-.293.767 0 1.06l4.798 4.798-4.798 4.798c-.293.293-.293.767 0 1.06.147.147.338.22.53.22.193 0 .384-.073.53-.22L8.079 9.14l4.798 4.797c.147.147.338.22.53.22.193 0 .384-.073.53-.22.294-.293.294-.767 0-1.06L9.14 8.078z" />
    </SVGIcon>
  );
};

export default Close;
