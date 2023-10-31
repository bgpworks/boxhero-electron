import React from "react";

import Button from "./Button";

interface NavButtonProps {
  isActive?: boolean;
  iconRenderer?: (isActive?: boolean) => React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const NavButton: React.FC<NavButtonProps> = ({
  iconRenderer,
  onClick,
  isActive = true,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={!isActive}>
      {iconRenderer(isActive)}
    </Button>
  );
};

export default React.memo(NavButton);
