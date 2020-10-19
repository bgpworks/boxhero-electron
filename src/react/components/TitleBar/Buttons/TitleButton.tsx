import React, { useState, useEffect } from 'react';
import { ipcRenderer } from '../../../constants';
import { SVGIconProps } from '../../svg-components/SVGIcon';
import Button from './Button';

interface TitleButtonProps {
  Icon: React.FC<SVGIconProps>;
  statName: 'canGoBack' | 'canGoForward';
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const TitleButton: React.FC<TitleButtonProps> = ({
  Icon,
  onClick,
  statName,
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    ipcRenderer.addListener(
      'sync-navigation',
      (stat: { canGoBack: boolean; canGoForward: boolean }) => {
        const nowStat = stat[statName];
        setIsActive(nowStat);
      }
    );
  }, []);

  return (
    <Button onClick={onClick}>
      <Icon color="#a0a4bb" opacity={isActive ? 1 : 0.5} />
    </Button>
  );
};

export default TitleButton;
