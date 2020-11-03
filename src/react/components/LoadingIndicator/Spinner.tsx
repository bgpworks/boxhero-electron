import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants';

const SpinnerSVG = styled.svg`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 80px;
  height: 80px;

  @keyframes SpinnerAnimationShow {
    0% {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes SpinnerAnimationRotation {
    0% {
      transform: scaleX(-1) rotate(0);
    }
    50% {
      transform: scaleX(-1) rotate(-180deg);
    }
    to {
      transform: scaleX(-1) rotate(-1turn);
    }
  }

  animation: SpinnerAnimationShow 0.25s normal ease,
    SpinnerAnimationRotation 0.7s linear infinite;
  transition-property: opacity, transform;
  transition-timing-function: ease;
  transform-origin: 50% 50%;

  ellipse {
    fill: transparent;
    stroke: ${COLORS.TITLEBAR_BG};
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-dasharray: 60;
    stroke-dashoffset: 20;
  }
`;

const Spinner: React.FC = () => {
  return (
    <SpinnerSVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="10" ry="10" />
    </SpinnerSVG>
  );
};

export default Spinner;
