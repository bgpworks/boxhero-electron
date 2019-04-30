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
        // identity는 Mac Developer 가 있어야함. 자동 선택으로 냅둠.
        "target": "mas-dev",
        "provisioningProfile": "cert/boxheromacdev.provisionprofile",
      },
      "mas": {
        "type": "development",
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
