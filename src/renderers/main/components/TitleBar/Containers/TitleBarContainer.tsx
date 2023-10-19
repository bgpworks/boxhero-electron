import styled from "styled-components";
import { COLORS, TITLEBAR_HEIGHT } from "../../../constants";
import { flexCenter } from "../../../styles/cssSnippets";

const TitleBarContainer = styled.header`
  height: ${TITLEBAR_HEIGHT};
  width: 100vw;

  ${flexCenter}

  background-color: ${COLORS.TITLEBAR_BG};

  position: relative;
`;

export default TitleBarContainer;
