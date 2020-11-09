import React from 'react';
import rdom from 'react-dom';

const appContainer = document.querySelector('#app');

rdom.render(
  <React.StrictMode>
    <div>업데이트 페이지 테스트</div>
  </React.StrictMode>,
  appContainer
);
