import React, { useLayoutEffect } from "react";

import i18n from "../locales/i18next";
import LoadingIndicator from "./components/LoadingIndicator";
import TitleBar from "./components/TitleBar";

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
