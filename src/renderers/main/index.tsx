import "../locales/i18next";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./app";
import GlobalStyle from "./styles/global";

declare const __BOXHERO_URL__: string;

// 환경에 따라 주입된 URL로 webview src 설정
const webview = document.getElementById("main-view") as Electron.WebviewTag;
webview.src = __BOXHERO_URL__;

const domNode = document.querySelector("#app")!;
const root = createRoot(domNode);

root.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>
);
