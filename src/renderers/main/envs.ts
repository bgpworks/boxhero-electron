export const platform = window.electronAPI.platform;
export const isWindow = platform === "win32";
export const isMac = platform === "darwin";
