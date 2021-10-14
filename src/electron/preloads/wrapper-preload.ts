import { ipcRenderer } from 'electron';

window.BOXHERO_IPC_RENDERER = ipcRenderer;
window.BOXHERO_PLATFORM = process.platform;

window.addEventListener('DOMContentLoaded', () => {
  const webview = document.querySelector('#main-view');
  window.BOXHERO_MAIN_VIEW = webview;
});
