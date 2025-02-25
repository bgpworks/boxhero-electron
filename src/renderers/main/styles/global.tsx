import { createGlobalStyle } from "styled-components";

import { TITLEBAR_HEIGHT } from "../constants";

const GlobalStyle = createGlobalStyle`
html {
  height: 100%;
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
`;

export default GlobalStyle;
