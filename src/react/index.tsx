import React from 'react';
import rdom from 'react-dom';
import App from './app';
import GlobalStyle from './GlobalStyle';

const appContainer = document.querySelector('#app');

rdom.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  appContainer
);
