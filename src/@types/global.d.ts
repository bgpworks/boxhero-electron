import type { WebviewTag, IpcRenderer } from 'electron';

export declare global {
  interface Window {
    BOXHERO_ELECTRON?: boolean;
    BOXHERO_IPC_RENDERER?: IpcRenderer;
    BOXHERO_MAIN_VIEW?: WebviewTag;
  }
}
