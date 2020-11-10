import React from 'react';
import rdom from 'react-dom';
import App from './app';

const appContainer = document.querySelector('#app');

rdom.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  appContainer
);
