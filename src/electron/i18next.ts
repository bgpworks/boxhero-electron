import path from 'path';
import i18n, { InitOptions } from 'i18next';
import { app } from 'electron';
import i18nBackend from 'i18next-node-fs-backend';

const i18nextOptions: InitOptions = {
  backend: {
    loadPath: path.resolve(
      app.getAppPath(),
      './locales/{{lng}}/electron/{{ns}}.json'
    ),
    addPath: path.resolve(
      app.getAppPath(),
      './locales/{{lng}}/electron/{{ns}}.missing.json'
    ),
    jsonIndent: 2,
  },
  ns: ['menu'],
  fallbackLng: 'en',
  saveMissing: true,
  supportedLngs: ['en', 'ko'],
};

i18n.use(i18nBackend);

export const initI18n = () => {
  if (!i18n.isInitialized) {
    i18n.init(i18nextOptions);
  }
};

export default i18n;
