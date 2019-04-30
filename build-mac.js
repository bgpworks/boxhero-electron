"use strict";

const builder = require("electron-builder");
const Platform = builder.Platform;

builder
  .build({
    targets: Platform.MAC.createTarget(),
    config: {
      "appId": "com.bgpworks.boxhero-mac",
      "productName": "Box Hero",
      "mac": {
        "target": "dmg",
        "identity": "BGPworks (AXBF9WS5F5)",
        "type": "distribution",
        "category": "public.app-category.business",
        "entitlements": "build/entitlements.mac.plist",
        "provisioningProfile": "cert/boxheromac.provisionprofile",
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
