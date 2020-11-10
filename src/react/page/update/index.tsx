import React from 'react';
import rdom from 'react-dom';
import GlobalStyle from '../../GlobalStyle';
import App from './app';
import i18n from '../../i18next';

const appContainer = document.querySelector('#update-root');

rdom.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  appContainer
);

i18n.init();
