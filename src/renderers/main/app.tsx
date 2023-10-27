import React, { useLayoutEffect } from "react";

import i18n from "../i18next";
import TitleBar from "./components/TitleBar";
import LoadingIndicator from "./components/TitleBar/LoadingIndicator";

const App: React.FC = () => {
  useLayoutEffect(() => {
    (async () => {
      const appLocale = await window.electronAPI.main.getAppLocale();
      i18n.changeLanguage(appLocale);
    })();
  }, []);
  return (
    <>
      <TitleBar />
      <LoadingIndicator />
    </>
  );
};

export default App;
