import styled from 'styled-components';
import { COLORS } from '../../../constants';

const TitleBarContainer = styled.header`
  height: 38px;
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${COLORS.TITLEBAR_BG};

  position: relative;
`;

export default TitleBarContainer;
