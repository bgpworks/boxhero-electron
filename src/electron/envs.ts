export const isWindow = process.platform === 'win32';
export const isMac = process.platform === 'darwin';
export const isDev = process.env.NODE_ENV === 'development';
