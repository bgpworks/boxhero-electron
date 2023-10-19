import React, { useLayoutEffect } from "react";
import TitleBar from "./components/TitleBar";
import i18n from "../i18next";

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
    </>
  );
};

export default App;
