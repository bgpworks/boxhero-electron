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
        "out/index.js",
        "out/store.js",
      ],
      "mac": {
        "target": "mas",
        "category": "public.app-category.business",
        "provisioningProfile": "cert/boxheromac.provisionprofile"
      },
      "mas": {
        "type": "distribution",
        "category": "public.app-category.business",
        "entitlements": "build/entitlements.mas.plist"
      }
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
