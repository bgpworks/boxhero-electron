require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;  
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appId = 'com.bgpworks.boxhero-mac';
  const appPath = `${appOutDir}/${appName}.app`;

  console.log(`Notarizing ${appId} found at ${appPath}`);

  try {
    await notarize({
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.APPLEID,
      appleIdPassword: process.env.APPLEIDPASS,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }

  console.log(`Done notarizing ${appId}`);
};
