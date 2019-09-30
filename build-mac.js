"use strict";

const builder = require("electron-builder");
const Platform = builder.Platform;

builder
  .build({
    targets: Platform.MAC.createTarget(),
    config: {
      "appId": "com.bgpworks.boxhero-mac",
      "productName": "Box Hero",
      "files": [
        "assets/",
        "index.js",
        "store.js",
      ],
      "mac": {
        "target": [
          "dmg"
        ],
        "identity": "BGPworks (AXBF9WS5F5)",
        "type": "distribution",
        "category": "public.app-category.business",
        "entitlements": "build/entitlements.mac.plist",
        "entitlementsInherit": "build/entitlements.mac.plist",
        "hardenedRuntime": true,
        "gatekeeperAssess": false,
        "provisioningProfile": "cert/boxheromac.provisionprofile",
        "publish": {
          "provider": "s3",
          "bucket": "boxhero-autoupdate",
          "acl": "public-read"
        }
      },
      "dmg": {
        "sign": false,
      },
      "afterSign": "./notarize.js"
    }
  })
  .then(() => {
    // handle result
    console.log('Build OK!');
  })
  .catch((error) => {
    // handle error
    console.error(error);
  });
