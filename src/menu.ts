import {
  app,
  dialog,
  Menu,
  MenuItemConstructorOptions,
  Notification,
  shell,
} from "electron";
import { i18n } from "i18next";

import { isBeta, isDev, isMac, isWindow } from "./envs";
import Updater from "./updater";
import { BoxHeroWindow, windowManager } from "./window";

const getContextMenuTemplate = (i18n: i18n) => {
  const contextTemplate: MenuItemConstructorOptions[] = [
    { label: i18n.t("menu:ctx_undo"), role: "undo" },
    { label: i18n.t("menu:ctx_redo"), role: "redo" },
    { type: "separator" },
    { label: i18n.t("menu:ctx_cut"), role: "cut" },
    { label: i18n.t("menu:ctx_copy"), role: "copy" },
    { label: i18n.t("menu:ctx_paste"), role: "paste" },
    { type: "separator" },
    { label: i18n.t("menu:ctx_select_all"), role: "selectAll" },
  ];

  return contextTemplate;
};

export const getContextMenu = (i18n: i18n) => {
  const contextTemplate = getContextMenuTemplate(i18n);
  return Menu.buildFromTemplate(contextTemplate);
};

export const getDockMenu = (i18n: i18n) => {
  return Menu.buildFromTemplate([
    {
      label: i18n.t("menu:file_new_window"),
      click: () => windowManager.open(BoxHeroWindow),
      accelerator: "CommandOrControl+o",
    },
  ]);
};

const getAppInformationMenu = (i18n: i18n): MenuItemConstructorOptions[] => {
  const appName = app.getName();

  return [
    {
      label: i18n.t("menu:appmenu_about", { appName }),
      click: () => {
        dialog.showMessageBoxSync({
          type: "info",
          message: appName,
          detail:
            `Version ${app.getVersion()}${isBeta ? "-beta" : ""}` +
            `\n\nCopyright © 2023 BGPWORKS, Inc.`,
        });
      },
    },
    { type: "separator" },
    {
      label: i18n.t("menu:check_for_updates"),
      click: () => {
        Updater.getInstance().checkForUpdates();
        const notification = new Notification({
          title: i18n.t("updater:check-notification"),
        });
        notification.show();
      },
    },
  ];
};

export const getMainMenu = (i18n: i18n) => {
  const appName = app.getName();
  const contextMenuTemplate = getContextMenuTemplate(i18n);
  const appInformationMenu = getAppInformationMenu(i18n);

  const appMenu: MenuItemConstructorOptions = {
    label: app.name,
    submenu: [
      ...appInformationMenu,
      { type: "separator" },
      { label: i18n.t("menu:appmenu_services"), role: "services" },
      { type: "separator" },
      { label: i18n.t("menu:appmenu_hide", { appName }), role: "hide" },
      { label: i18n.t("menu:appmenu_hide_other"), role: "hideOthers" },
      { label: i18n.t("menu:appmenu_unhide"), role: "unhide" },
      { type: "separator" },
      {
        label: i18n.t("menu:appmenu_quit", { appName }),
        role: "quit",
      },
    ],
    visible: isMac,
  };

  const fileMenu: MenuItemConstructorOptions = {
    label: i18n.t("menu:file"),
    submenu: [
      {
        label: i18n.t("menu:file_new_window"),
        click: () => windowManager.open(BoxHeroWindow),
        accelerator: "CommandOrControl+o",
      },
      { label: i18n.t("menu:file_close"), role: "close", visible: isMac },
    ],
  };

  const editMenu: MenuItemConstructorOptions = {
    label: i18n.t("menu:edit"),
    submenu: contextMenuTemplate,
  };

  const viewMenu: MenuItemConstructorOptions = {
    label: i18n.t("menu:view"),
    submenu: [
      {
        label: i18n.t("menu:view_reload"),
        accelerator: "CommandOrControl + r",
        click: (_, focusedWindow) => {
          if (!(focusedWindow instanceof BoxHeroWindow)) return;

          focusedWindow.webviewContents?.reload();
        },
      },
      {
        label: i18n.t("menu:view_go_back"),
        accelerator: isMac ? "cmd+[" : "alt+left",
        click: (_, focusedWindow) => {
          if (!(focusedWindow instanceof BoxHeroWindow)) return;

          focusedWindow.webviewContents?.goBack();
        },
      },
      {
        label: i18n.t("menu:view_go_forward"),
        accelerator: isMac ? "cmd+]" : "alt+right",
        click: (_, focusedWindow) => {
          if (!(focusedWindow instanceof BoxHeroWindow)) return;

          focusedWindow.webviewContents?.goForward();
        },
      },
      { type: "separator" },
      {
        label: i18n.t("menu:view_toggle_fullscreen"),
        role: "togglefullscreen",
      },
      { type: "separator" },
      { label: i18n.t("menu:view_minimize"), role: "minimize" },
      { type: "separator" },
      { label: i18n.t("menu:view_zoom_in"), role: "zoomIn" },
      { label: i18n.t("menu:view_zoom_out"), role: "zoomOut" },
    ],
  };

  const devtoolMenu: MenuItemConstructorOptions = {
    label: i18n.t("menu:dev"),
    submenu: [
      {
        label: i18n.t("menu:view_toggle_wrapper_dev_tools"),
        role: "toggleDevTools",
      },
      {
        label: i18n.t("menu:view_toggle_target_dev_tools"),
        click: (_, focusedWindow) => {
          if (!(focusedWindow instanceof BoxHeroWindow)) return;

          focusedWindow.webviewContents?.toggleDevTools();
        },
      },
    ],
    visible: isDev,
  };

  const helpMenu: MenuItemConstructorOptions = {
    label: i18n.t("menu:help"),
    submenu: [
      {
        label: i18n.t("menu:help_support"),
        click: async () => {
          await shell.openExternal(i18n.t("menu:support_url"));
        },
      },
      {
        label: i18n.t("menu:help_blog"),
        click: async () => {
          await shell.openExternal(i18n.t("menu:blog_url"));
        },
      },
    ],
  };

  const mainMenuTemplate: MenuItemConstructorOptions[] = [
    appMenu,
    ...(isWindow ? appInformationMenu : []),
    fileMenu,
    editMenu,
    viewMenu,
    devtoolMenu,
    helpMenu,
    {
      label: i18n.t("menu:appmenu_quit", { appName }),
      role: "quit",
      visible: isWindow,
    },
  ];

  return Menu.buildFromTemplate(mainMenuTemplate);
};
