import { createGlobalStyle } from "styled-components";

import { TITLEBAR_HEIGHT } from "../constants";

const GlobalStyle = createGlobalStyle`
html {
  height: 100%;
  text-size-adjust: 100%;
  font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
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
