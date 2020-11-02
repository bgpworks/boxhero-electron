import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';
import { TITLEBAR_HEIGHT } from './constants';
import NotoSans from './noto-sans-kr.woff2';

const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: 'Noto Sans';
  src: url(${NotoSans});
  font-style: normal;
  font-weight: 400;
}

${normalize};

html {
  height: 100%;
  text-size-adjust: 100%;
  font-family: 'Noto Sans';
  font-size: 16px;
}
body {
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
