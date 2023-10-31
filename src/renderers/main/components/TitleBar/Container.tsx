import React, { ReactNode } from "react";
import { styled } from "styled-components";

import { COLORS, TITLEBAR_HEIGHT } from "../../constants";
import { flexCenter } from "../../styles/cssSnippets";

/*
윈도 환경에서 좌상단 우상단 포인트에서 크기 조절이 되려면,
일정 크기를 -webkit-app-region 을 no-drag 상태로 유지해야 함.
이를 위해 아래 스타일 코드에서는 상/좌우 영역에 5px씩의 공간의 여유를 만들었음.
*/
const DraggableBackground = styled.div`
  width: calc(100vw - 10px);
  height: 33px;

  -webkit-app-region: drag;
  user-select: none;

  position: absolute;
  left: 5px;
  top: 5px;

  z-index: 9998;
`;

const Background = styled.header`
  height: ${TITLEBAR_HEIGHT};
  width: 100vw;

  ${flexCenter}

  background-color: ${COLORS.TITLEBAR_BG};

  position: relative;
`;

function Container({ children }: { children: ReactNode }) {
  const { toggleMaximize } = window.electronAPI.window;

  return (
    <Background>
      <DraggableBackground onDoubleClick={toggleMaximize} />
      {children}
    </Background>
  );
}

export default Container;
