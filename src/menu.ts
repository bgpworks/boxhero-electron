import { app, Menu, MenuItemConstructorOptions, shell } from "electron";
import { i18n } from "i18next";

import { isBeta, isDev, isMac, isWindow } from "./envs";
import { checkIfActiveBoxHeroWindow } from "./utils";
import { getViewState } from "./viewState";
import { BoxHeroWindow, windowRegistry } from "./window";

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
      click: () => new BoxHeroWindow(windowRegistry),
      accelerator: "CommandOrControl+o",
    },
  ]);
};

export const getMainMenu = (i18n: i18n) => {
  const appName = app.getName();
  const contextMenuTemplate = getContextMenuTemplate(i18n);

  const appMenu: MenuItemConstructorOptions = {
    label: app.name,
    submenu: [
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
        click: () => new BoxHeroWindow(windowRegistry),
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
        click: () => {
          const focusedWindow = windowRegistry.getFocusedWindow();

          if (!checkIfActiveBoxHeroWindow(focusedWindow)) return;

          focusedWindow.webviewContents.reload();
        },
      },
      {
        label: i18n.t("menu:view_go_back"),
        accelerator: isMac ? "cmd+[" : "alt+left",
        click: () => {
          const focusedWindow = windowRegistry.getFocusedWindow();

          if (!checkIfActiveBoxHeroWindow(focusedWindow)) return;

          focusedWindow.webviewContents.goBack();
        },
      },
      {
        label: i18n.t("menu:view_go_forward"),
        accelerator: isMac ? "cmd+]" : "alt+right",
        click: () => {
          const focusedWindow = windowRegistry.getFocusedWindow();

          if (!checkIfActiveBoxHeroWindow(focusedWindow)) return;

          focusedWindow.webviewContents.goForward();
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
        click: () => {
          const { targetContents } = getViewState();
          targetContents && targetContents.openDevTools();
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
      { type: "separator" },
      {
        label: `Ver. ${app.getVersion()}${isBeta ? "-beta" : ""}`,
      },
    ],
  };

  const mainMenuTemplate: MenuItemConstructorOptions[] = [
    appMenu,
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
