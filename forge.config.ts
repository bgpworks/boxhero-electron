import dotenv from "dotenv";
import path from "path";

import { MakerDMG } from "@electron-forge/maker-dmg";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { PublisherGithub } from "@electron-forge/publisher-github";
import { PublisherS3 } from "@electron-forge/publisher-s3";

import type { ForgeConfig } from "@electron-forge/shared-types";

dotenv.config();

const WIN_CERT_THUMBPRINT = process.env["WIN_CERT_THUMBPRINT"] ?? "";
const APPLE_APP_BUNDLE_ID = process.env["APPLE_APP_BUNDLE_ID"] ?? "";
const APPLE_CERTIFICATE_IDENTITY =
  process.env["APPLE_CERTIFICATE_IDENTITY"] ?? "";
const APPLE_API_KEY_ID = process.env["APPLE_API_KEY_ID"] ?? "";
const APPLE_API_ISSUER = process.env["APPLE_API_ISSUER"] ?? "";

const config: ForgeConfig = {
  packagerConfig: {
    name: "BoxHero",
    icon: "./build/icon",
    appBundleId: APPLE_APP_BUNDLE_ID,
    osxSign: {
      identity: APPLE_CERTIFICATE_IDENTITY,
      type: "distribution",
      identityValidation: true,
    },
    osxNotarize: {
      tool: "notarytool",
      appleApiKey: `./AuthKey_${APPLE_API_KEY_ID}.p8`,
      appleApiKeyId: APPLE_API_KEY_ID,
      appleApiIssuer: APPLE_API_ISSUER,
    },
    appCategoryType: "public.app-category.business",
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: "BoxHero",
      signWithParams: `/fd sha256 /sha1 ${WIN_CERT_THUMBPRINT} /tr http://timestamp.digicert.com /td sha256`,
      setupIcon: path.resolve(__dirname, "./build/icon.ico"),
    }),
    new MakerDMG({
      name: "BoxHero",
      icon: "./build/icon.icns",
      additionalDMGOptions: { "background-color": "#4f67ff" },
    }),
  ],
  publishers: [
    new PublisherGithub({
      repository: { owner: "bgpworks", name: "boxhero-electron" },
      prerelease: true,
      draft: true,
    }),
    new PublisherS3({
      bucket: "boxhero-autoupdate",
      public: true,
      keyResolver(fileName, platform, arch) {
        return `${platform}-${arch}/${fileName}`;
      },
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
