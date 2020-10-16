import { ipcRenderer } from 'electron';
import { windows } from './window';

// 클라이언트단에서 electron 여부임을 식별하기 위한 전역 변수 설정.
window.BOXHERO_ELECTRON = true;
window.BOXHERO_IPC_RENDERER = ipcRenderer;
window.BOXHERO_MAIN_VIEW = windows.mainView;

window.addEventListener('popstate', () => {
  ipcRenderer.send('sync-stat');
});
