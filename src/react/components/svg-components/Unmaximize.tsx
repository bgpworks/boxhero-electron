import React from 'react';
import SVGIcon, { SVGIconProps } from './SVGIcon';

const Unmaximize: React.FC<SVGIconProps> = ({
  color,
  opacity = 1,
  ...restProps
}) => {
  return (
    <SVGIcon {...restProps}>
      <defs>
        <path
          id="ew32mzlzsa"
          d="M2.3 5h8.4c.165 0 .3.135.3.3v8.4c0 .165-.135.3-.3.3H2.3c-.165 0-.3-.135-.3-.3V5.3c0-.165.135-.3.3-.3zm7.2 1.5H3.8c-.165 0-.3.135-.3.3v5.4c0 .165.135.3.3.3h5.4c.165 0 .3-.135.3-.3V6.5zM6 2.3c0-.165.135-.3.3-.3h7.4c.165 0 .3.135.3.3v7.4c0 .165-.135.3-.3.3h-.9c-.165 0-.3-.135-.3-.3V3.8c0-.165-.135-.3-.3-.3H6.3c-.165 0-.3-.135-.3-.3v-.9z"
        />
      </defs>
      <g fill="none" fill-rule="evenodd">
        <mask id="axrwygqhzb" fill="#fff">
          <use xlinkHref="#ew32mzlzsa" />
        </mask>
        <use fill="#000" xlinkHref="#ew32mzlzsa" />
        <path
          fill={color}
          opacity={opacity}
          d="M0 0H16V16H0z"
          mask="url(#axrwygqhzb)"
        />
      </g>
    </SVGIcon>
  );
};

export default Unmaximize;
