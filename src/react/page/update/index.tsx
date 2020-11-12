import React from 'react';
import rdom from 'react-dom';
import Updater from '../../components/Updater';
import GlobalStyle from '../../GlobalStyle';
import i18n from '../../i18next';

const appContainer = document.querySelector('#update-root');

rdom.render(
  <React.StrictMode>
    <GlobalStyle />
    <Updater />
  </React.StrictMode>,
  appContainer
);

i18n.init();
