import { createGlobalStyle } from "styled-components";
import { TITLEBAR_HEIGHT } from "../constants";
import NotoSans from "./noto-sans-kr.woff2";

const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: 'Noto Sans';
  src: url(${NotoSans});
  font-style: normal;
  font-weight: 400;
}

html {
  height: 100%;
  text-size-adjust: 100%;
  font-family: 'Noto Sans';
  font-size: 16px;
}

body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

*, *:after, *:before {
  box-sizing: border-box;
}

#root {
  min-height: 100%;
}

#main-view {
  width: 100vw;
  height: calc(100vh - ${TITLEBAR_HEIGHT});
}

#update-root {
  height: 100%;
  background-color: #ececec;
}
`;

export default GlobalStyle;
