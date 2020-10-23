import i18n from '../i18next';
import { getMainMenu } from '../menu';
import { getCurrentViews, setMainIPC, syncNavStat } from './utils';

export const initViewIPC = () => {
  setMainIPC
    .handle('history-go-back', () => {
      const { targetContents } = getCurrentViews();
      if (!targetContents) return;

      targetContents.goBack();
      syncNavStat();
    })
    .handle('history-go-forward', () => {
      const { targetContents } = getCurrentViews();
      if (!targetContents) return;

      targetContents.goForward();
      syncNavStat();
    })
    .handle('history-refresh', () => {
      const { targetContents } = getCurrentViews();
      if (!targetContents) return;

      targetContents.reload();
      syncNavStat();
    })
    .handle('open-main-menu', () => {
      const { wrapperContents } = getCurrentViews();
      if (!wrapperContents) return;

      getMainMenu(i18n).popup({
        x: 20,
        y: 38,
      });
    });
};
