import type { IpcRenderer, IpcRendererEvent } from 'electron';
import React, { useEffect, useState } from 'react';
import Button from './Button';
import { SVGIconProps } from './svg-components/SVGIcon';

interface TitleButtonProps {
  Icon: React.FC<SVGIconProps>;
  statName: 'canGoBack' | 'canGoForward';
  eventName: string;
}

const ipcRenderer = (window as any).BOXHERO_IPC_RENDERER as IpcRenderer;

const TitleButton: React.FC<TitleButtonProps> = ({ Icon, eventName, statName }) => {
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    ipcRenderer.on(
      'reload-stat',
      (
        _,
        stat: {
          canGoBack: boolean;
          canGoForward: boolean;
        }
      ) => {
        const nowStat = stat[statName];
        setIsActive(nowStat);
      }
    );
  }, []);

  return (
    <Button
      onClick={() => {
        ipcRenderer.send('sync-stat');
        ipcRenderer.send(eventName);
      }}
    >
      <Icon color="#a0a4bb" opacity={isActive ? 1 : 0.5} />
    </Button>
  );
};

export default TitleButton;
