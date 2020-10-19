import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

const GlobalStyle = createGlobalStyle`
${normalize};
html {
  height: 100%;
  text-size-adjust: 100%;
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
`;

export default GlobalStyle;
