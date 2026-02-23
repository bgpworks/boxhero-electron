import initAppIPC from "./initAppIPC";
import initGoogleAuth from "./initGoogleAuth";
import initLabelPrinter from "./initLabelPrinter";
import initLocale from "./initLocale";
import initNavigationIPC from "./initNavigationIPC";
import initUpdater from "./initUpdater";
import initWindowIPC from "./initWindowIPC";

async function initialize() {
  await initLocale();

  initAppIPC();
  initWindowIPC();
  initNavigationIPC();

  initGoogleAuth();
  initUpdater();
  initLabelPrinter();
}

export default initialize;
