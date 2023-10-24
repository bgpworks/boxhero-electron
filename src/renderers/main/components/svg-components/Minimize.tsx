import React from "react";

import SVGIcon, { SVGIconProps } from "./SVGIcon";

const Minimize: React.FC<SVGIconProps> = (props) => {
  return (
    <SVGIcon {...props}>
      <path d="M11.75 8.5h-8c-.414 0-.75-.336-.75-.75S3.336 7 3.75 7h8c.414 0 .75.336.75.75s-.336.75-.75.75" />
    </SVGIcon>
  );
};

export default Minimize;
