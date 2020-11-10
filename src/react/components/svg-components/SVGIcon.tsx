import styled, { css } from 'styled-components';

export interface SVGIconProps {
  color?: string;
  width?: string;
  height?: string;
  opacity?: number;
}

const SVGIcon = styled.svg<SVGIconProps>`
  ${({ color = 'white', width = '100%', height = '100%', opacity = 1 }) => css`
    fill: ${color};
    width: ${width};
    height: ${height};
    opacity: ${opacity};
  `};
`;

export default SVGIcon;
