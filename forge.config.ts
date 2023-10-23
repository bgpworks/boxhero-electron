import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerDMG } from "@electron-forge/maker-dmg";
import { VitePlugin } from "@electron-forge/plugin-vite";

const config: ForgeConfig = {
  packagerConfig: {
    name: "BoxHero",
    icon: "./build/icon",
    osxSign: {
      identity: "BGPworks (AXBF9WS5F5)",
      type: "distribution",
      optionsForFile: () => {
        return {
          entitlements: "./build/entitlements.mac.plist",
        };
      },
    },
    appCategoryType: "public.app-category.business",
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: "BoxHero",
      signWithParams:
        "/tr http://timestamp.digicert.com /td sha256 /fd sha256 /a",
    }),
    new MakerDMG({
      name: "BoxHero",
      icon: "./build/icon.icns",
      additionalDMGOptions: { "background-color": "#4f67ff" },
    }),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: "src/main.ts",
          config: "vite.main.config.ts",
        },
        {
          entry: "src/preload.ts",
          config: "vite.preload.config.ts",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer-main.config.ts",
        },
      ],
    }),
  ],
};

export default config;
