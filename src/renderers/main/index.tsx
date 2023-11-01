import "../locales/i18next";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./app";
import GlobalStyle from "./styles/global";

const domNode = document.querySelector("#app")!;
const root = createRoot(domNode);

root.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>
);
