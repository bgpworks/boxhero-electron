import styled from 'styled-components';
import { COLORS } from '../../../constants';
import { flexCenter } from '../../../styles/cssSnippets';

const TitleBarContainer = styled.header`
  height: 38px;
  width: 100vw;

  ${flexCenter}

  background-color: ${COLORS.TITLEBAR_BG};

  position: relative;
`;

export default TitleBarContainer;
