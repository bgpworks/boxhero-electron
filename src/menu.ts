import { app, shell, Menu, MenuItemConstructorOptions } from "electron";
import { isDev, isMac, isWindow } from "./envs";
import { i18n } from "i18next";
import { navGoBack, navGoForward, navReload } from "./ipc/utils";
import { openBoxHero, openUpdateWindow } from "./window";
import { getViewState } from "./utils/manageViewState";

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

export const getMainMenu = (i18n: i18n) => {
  const appName = app.getName();
  const contextMenuTemplate = getContextMenuTemplate(i18n);

  const appMenu: MenuItemConstructorOptions[] = [
    {
      label: app.name,
      submenu: [
        {
          label: `Ver. ${app.getVersion()}`,
        },
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
    },
  ];

  const additionalFileMenu: MenuItemConstructorOptions = isMac
    ? { label: i18n.t("menu:file_close"), role: "close" }
    : {
        label: i18n.t("menu:appmenu_update", { appName }),
        click: openUpdateWindow,
      };
  const fileMenu: MenuItemConstructorOptions = {
    label: i18n.t("menu:file"),
    submenu: [
      {
        label: i18n.t("menu:file_new_window"),
        click: openBoxHero,
        accelerator: "CommandOrControl+o",
      },
      additionalFileMenu,
    ],
  };

  const editMenu: MenuItemConstructorOptions = {
    label: i18n.t("menu:edit"),
    submenu: contextMenuTemplate,
  };

  const devtoolMenuItem: MenuItemConstructorOptions[] = isDev
    ? [
        { type: "separator" },
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
      ]
    : [];

  const viewMenu: MenuItemConstructorOptions = {
    label: i18n.t("menu:view"),
    submenu: [
      {
        label: i18n.t("menu:view_reload"),
        accelerator: "CommandOrControl + r",
        click: navReload,
      },
      {
        label: i18n.t("menu:view_go_back"),
        accelerator: isMac ? "cmd+[" : "alt+left",
        click: navGoBack,
      },
      {
        label: i18n.t("menu:view_go_forward"),
        accelerator: isMac ? "cmd+]" : "alt+right",
        click: navGoForward,
      },
      { type: "separator" },
      {
        label: i18n.t("menu:view_toggle_fullscreen"),
        role: "togglefullscreen",
      },
      ...devtoolMenuItem,
      { type: "separator" },
      { label: i18n.t("menu:view_minimize"), role: "minimize" },
      { type: "separator" },
      { label: i18n.t("menu:view_zoom_in"), role: "zoomIn" },
      { label: i18n.t("menu:view_zoom_out"), role: "zoomOut" },
    ],
  };

  const helpCenterURL = i18n.t("menu:support_url");
  const blogURL = i18n.t("menu:blog_url");

  const helpMenu: MenuItemConstructorOptions = {
    label: i18n.t("menu:help"),
    submenu: [
      {
        label: i18n.t("menu:help_support"),
        click: async () => {
          await shell.openExternal(helpCenterURL);
        },
      },
      {
        label: i18n.t("menu:help_blog"),
        click: async () => {
          await shell.openExternal(blogURL);
        },
      },
    ],
  };
  const windowQuit: MenuItemConstructorOptions[] = [
    { label: i18n.t("menu:appmenu_quit", { appName }), role: "quit" },
  ];

  const mainMenuTemplate: MenuItemConstructorOptions[] = [
    ...(isMac ? appMenu : []),
    fileMenu,
    editMenu,
    viewMenu,
    helpMenu,
    ...(isWindow ? windowQuit : []),
  ];

  return Menu.buildFromTemplate(mainMenuTemplate);
};
