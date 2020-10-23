import { app, shell, Menu, MenuItemConstructorOptions } from 'electron';
import { isMac, isWindow } from './envs';
import { i18n } from 'i18next';
import { navGoBack, navGoForward, navReload } from './ipc/utils';
import { openBoxHero } from './window';

const getContextMenuTemplate = (i18n: i18n) => {
  const contextTemplate: MenuItemConstructorOptions[] = [
    { label: i18n.t('ctx_undo'), role: 'undo' },
    { label: i18n.t('ctx_redo'), role: 'redo' },
    { type: 'separator' },
    { label: i18n.t('ctx_cut'), role: 'cut' },
    { label: i18n.t('ctx_copy'), role: 'copy' },
    { label: i18n.t('ctx_paste'), role: 'paste' },
    { type: 'separator' },
    { label: i18n.t('ctx_select_all'), role: 'selectAll' },
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
        { label: i18n.t('menu_appmenu_about'), role: 'about' },
        { type: 'separator' },
        { label: i18n.t('menu_appmenu_services'), role: 'services' },
        { type: 'separator' },
        { label: i18n.t('menu_appmenu_hide'), role: 'hide' },
        { label: i18n.t('menu_appmenu_hide_other'), role: 'hideOthers' },
        { label: i18n.t('menu_appmenu_unhide'), role: 'unhide' },
        { type: 'separator' },
        { label: i18n.t('menu_appmenu_quit', { appName }), role: 'quit' },
      ],
    },
  ];

  const fileMenu: MenuItemConstructorOptions = {
    label: i18n.t('menu_file'),
    submenu: [
      isMac
        ? { label: i18n.t('menu_file_close'), role: 'close' }
        : { label: i18n.t('menu_appmenu_quit', { appName }), role: 'quit' },
      {
        label: i18n.t('menu_file_new_window'),
        click: openBoxHero,
        accelerator: 'CommandOrControl+o',
      },
    ],
  };

  const editMenu: MenuItemConstructorOptions = {
    label: i18n.t('menu_edit'),
    submenu: contextMenuTemplate,
  };

  const viewMenu: MenuItemConstructorOptions = {
    label: i18n.t('menu_view'),
    submenu: [
      {
        label: i18n.t('menu_view_reload'),
        accelerator: 'CommandOrControl + r',
        click: navReload,
      },
      {
        label: i18n.t('menu_view_go_back'),
        accelerator: isMac ? 'cmd+[' : 'alt+left',
        click: navGoBack,
      },
      {
        label: i18n.t('menu_view_go_forward'),
        accelerator: isMac ? 'cmd+]' : 'alt+right',
        click: navGoForward,
      },
      { type: 'separator' },
      {
        label: i18n.t('menu_view_toggle_fullscreen'),
        role: 'togglefullscreen',
      },
      { label: i18n.t('menu_view_toggle_dev_tools'), role: 'toggleDevTools' },
      { type: 'separator' },
      { label: i18n.t('menu_view_minimize'), role: 'minimize' },
      { type: 'separator' },
      { label: i18n.t('menu_view_zoom_in'), role: 'zoomIn' },
      { label: i18n.t('menu_view_zoom_out'), role: 'zoomOut' },
    ],
  };

  const helpCenterURL = i18n.t('support_url');
  const blogURL = i18n.t('blog_url');

  const helpMenu: MenuItemConstructorOptions = {
    label: i18n.t('menu_help'),
    submenu: [
      {
        label: i18n.t('menu_help_support'),
        click: async () => {
          await shell.openExternal(helpCenterURL);
        },
      },
      {
        label: i18n.t('menu_help_blog'),
        click: async () => {
          await shell.openExternal(blogURL);
        },
      },
    ],
  };
  const windowQuit: MenuItemConstructorOptions[] = [
    { label: i18n.t('menu_appmenu_quit', { appName }), role: 'quit' },
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
