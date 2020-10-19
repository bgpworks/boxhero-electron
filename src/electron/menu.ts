import { app, shell, Menu, MenuItemConstructorOptions } from 'electron';
import { isMac, isWindow } from './env';

export const template: any[] = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        },
      ]
    : []),
  {
    label: 'File',
    submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { role: 'cut' },
      { role: 'copy' },
      { type: 'separator' },
      { role: 'paste' },
      { role: 'selectAll' },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'togglefullscreen' },
      { role: 'toggledevtools' },
      { role: 'minimize' },
      { type: 'separator' },
      { role: 'zoomin' },
      { role: 'zoomout' },
    ],
  },
  {
    label: 'History',
    submenu: [{ label: 'back' }, { label: 'forward' }],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: '박스히어로 고객센터',
        click: async () => {
          await shell.openExternal('https://docs-ko.boxhero-app.com/');
        },
      },
      {
        label: '블로그',
        click: async () => {
          await shell.openExternal('https://medium.com/boxhero');
        },
      },
    ],
  },
  ...(isWindow ? [{ role: 'quit' }] : []),
];

export const contextTemplate: MenuItemConstructorOptions[] = [
  { role: 'undo' },
  { role: 'redo' },
  { role: 'cut' },
  { role: 'copy' },
  { type: 'separator' },
  { role: 'paste' },
  { role: 'selectAll' },
];

export const menu = Menu.buildFromTemplate(template);
export const contextMenu = Menu.buildFromTemplate(contextTemplate);
