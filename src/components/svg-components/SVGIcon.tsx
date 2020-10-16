import styled, { css } from 'styled-components';

export interface SVGIconProps {
  color?: string;
  width?: string;
  height?: string;
}

const SVGIcon = styled.svg<SVGIconProps>`
  ${({ color = 'white', width = '100%', height = '100%' }) => css`
    fill: ${color};
    width: ${width};
    height: ${height};
  `};
`;

export default SVGIcon;
