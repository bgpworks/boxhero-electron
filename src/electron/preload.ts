import { ipcRenderer, WebviewTag } from 'electron';

// 클라이언트단에서 electron 여부임을 식별하기 위한 전역 변수 설정.
window.BOXHERO_ELECTRON = true;
window.BOXHERO_IPC_RENDERER = ipcRenderer;
window.BOXHERO_PLATFORM = process.platform;

document.addEventListener('DOMContentLoaded', () => {
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
