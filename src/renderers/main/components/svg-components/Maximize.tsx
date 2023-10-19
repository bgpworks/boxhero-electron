import React from "react";
import SVGIcon, { SVGIconProps } from "./SVGIcon";
const Maximize: React.FC<SVGIconProps> = ({
  color,
  opacity = 1,
  ...restProps
}) => {
  return (
    <SVGIcon {...restProps}>
      <defs>
        <path
          id="s8k1dfhj3a"
          d="M13.7 2H2.3c-.165 0-.3.135-.3.3v11.4c0 .165.135.3.3.3h11.4c.165 0 .3-.135.3-.3V2.3c0-.165-.135-.3-.3-.3zM3.5 12.5h9v-9h-9v9z"
        />
      </defs>
      <g
        fill="none"
        fillRule="evenodd">
        <mask
          id="tvxsw7icnb"
          fill="#fff">
          <use xlinkHref="#s8k1dfhj3a" />
        </mask>
        <path
          fill={color}
          opacity={opacity}
          d="M0 0H16V16H0z"
          mask="url(#tvxsw7icnb)"
        />
      </g>
    </SVGIcon>
  );
};

export default Maximize;
