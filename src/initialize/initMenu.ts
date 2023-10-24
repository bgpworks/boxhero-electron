import { app, Menu } from "electron";

import { isMac } from "../envs";
import i18n from "../i18next";
import { getDockMenu, getMainMenu } from "../menu";

export function initMenu() {
  const appMenu = getMainMenu(i18n);
  Menu.setApplicationMenu(appMenu);

  if (isMac) {
    const dockMenu = getDockMenu(i18n);
    app.dock.setMenu(dockMenu);
  }
}
