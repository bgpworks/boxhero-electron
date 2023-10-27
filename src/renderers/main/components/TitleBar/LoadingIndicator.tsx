import React from "react";
import styled, { keyframes } from "styled-components";

import { COLORS, TITLEBAR_HEIGHT } from "../../constants";
import { useContents } from "../../hooks/useContents";

const BAR_HEIGHT = "3px";

const indeterminate = keyframes`
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }`;

const LoadingBar = styled.div`
  width: 100%;
  height: ${BAR_HEIGHT};

  background-color: transparent;

  position: fixed;
  top: ${TITLEBAR_HEIGHT};
  left: 0;

  overflow: hidden;

  &::before {
    content: "";
    display: block;
    position: absolute;

    top: -1px;
    left: 0;
    right: 0;
    height: ${BAR_HEIGHT};

    background-color: ${COLORS.PRIMARY};
    animation: ${indeterminate} 1s cubic-bezier(0.65, 0.815, 0.735, 0.395)
      infinite;
  }
`;

function LoadingIndicator() {
  const { initialized, loading } = useContents();

  if (!loading && initialized) return null;

  return <LoadingBar />;
}

export default LoadingIndicator;
