import { app, Menu } from "electron";

import { isMac } from "../envs";
import i18n from "../locales/i18next";
import { getDockMenu, getMainMenu } from "../menu";

function initMenu() {
  const appMenu = getMainMenu(i18n);
  Menu.setApplicationMenu(appMenu);

  if (isMac) {
    const dockMenu = getDockMenu(i18n);
    app.dock.setMenu(dockMenu);
  }
}

export default initMenu;
