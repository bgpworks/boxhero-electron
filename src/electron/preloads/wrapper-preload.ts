import { ipcRenderer, WebviewTag } from 'electron';

window.BOXHERO_IPC_RENDERER = ipcRenderer;
window.BOXHERO_PLATFORM = process.platform;

window.addEventListener('DOMContentLoaded', () => {
  const webview = document.querySelector('#main-view') as WebviewTag;
  window.BOXHERO_MAIN_VIEW = webview;

  webview.addEventListener('did-navigate', () => {
    const navigationStat = {
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
    };

    ipcRenderer.emit('sync-navigation', navigationStat);
  });

  webview.addEventListener('did-navigate-in-page', () => {
    const navigationStat = {
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
    };

    ipcRenderer.emit('sync-navigation', navigationStat);
  });
});
