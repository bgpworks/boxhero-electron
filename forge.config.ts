import dotenv from "dotenv";
import path from "path";

import { MakerDMG } from "@electron-forge/maker-dmg";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { PublisherGithub } from "@electron-forge/publisher-github";
import { PublisherS3 } from "@electron-forge/publisher-s3";

import type { ForgeConfig } from "@electron-forge/shared-types";

dotenv.config();

// win32
const WIN_CERT_THUMBPRINT = process.env["WIN_CERT_THUMBPRINT"] ?? "";

// darwin
const APPLE_APP_BUNDLE_ID = process.env["APPLE_APP_BUNDLE_ID"] ?? "";
const APPLE_CERTIFICATE_IDENTITY =
  process.env["APPLE_CERTIFICATE_IDENTITY"] ?? "";
const APPLE_API_KEY_ID = process.env["APPLE_API_KEY_ID"] ?? "";
const APPLE_API_ISSUER = process.env["APPLE_API_ISSUER"] ?? "";
const FEED_BASE_URL = process.env["FEED_BASE_URL"] ?? "";

// r2
const R2_ACCESS_KEY_ID = process.env["R2_ACCESS_KEY_ID"] ?? "";
const R2_SECRET_ACCESS_KEY = process.env["R2_SECRET_ACCESS_KEY"] ?? "";
const R2_DEFAULT_REGION = process.env["R2_DEFAULT_REGION"] ?? "auto";
const R2_BUCKET = process.env["R2_BUCKET"] ?? "boxhero-desktop";
const R2_ENDPOINT =
  process.env["R2_ENDPOINT"] ??
  "https://4581e8ae53759accbfac5449017db485.r2.cloudflarestorage.com";

// dev
const skipSign = process.env["DEV_SKIP_SIGN"] === "t";
const isBeta = process.env["DEV_USE_BETA_LANE"] === "t";

const appName = isBeta ? `BoxHero-beta` : "BoxHero";
const prefix = isBeta ? `${process.platform}-beta` : `${process.platform}`;

const config: ForgeConfig = {
  packagerConfig: {
    name: appName,
    icon: "./build/icon",
    appBundleId: APPLE_APP_BUNDLE_ID,
    ...(!skipSign
      ? {
          osxSign: {
            identity: APPLE_CERTIFICATE_IDENTITY,
            type: "distribution",
            identityValidation: true,
          },
          osxNotarize: {
            appleApiKey: `./AuthKey_${APPLE_API_KEY_ID}.p8`,
            appleApiKeyId: APPLE_API_KEY_ID,
            appleApiIssuer: APPLE_API_ISSUER,
          },
        }
      : {}),
    appCategoryType: "public.app-category.business",
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: appName,
      signWithParams: !skipSign
        ? `/fd sha256 /sha1 ${WIN_CERT_THUMBPRINT} /tr http://timestamp.digicert.com /td sha256`
        : undefined,
      iconUrl:
        "https://github.com/bgpworks/boxhero-electron/blob/main/build/icon.ico?raw=true",
      setupIcon: path.resolve(__dirname, "./build/icon.ico"),
      loadingGif: path.resolve(__dirname, "./build/loading.gif"),
    }),
    new MakerZIP({
      macUpdateManifestBaseUrl: `${FEED_BASE_URL}/${prefix}`,
    }),
    new MakerDMG({
      name: appName,
      icon: path.resolve(__dirname, "./build/icon.icns"),
      background: path.resolve(__dirname, "./build/dmg-bg.png"),
      iconSize: 62,
      overwrite: true,
      additionalDMGOptions: {
        "background-color": "#ecf1f9",
        window: {
          size: { width: 560, height: 400 },
          position: { x: 200, y: 120 },
        },
      },
      contents: (opts) => [
        {
          type: "file",
          path: (opts as { appPath: string }).appPath,
          x: 164,
          y: 200,
        },
        {
          type: "link",
          path: "/Applications",
          x: 409,
          y: 200,
        },
      ],
    }),
  ],
  publishers: [
    new PublisherGithub({
      repository: { owner: "bgpworks", name: "boxhero-electron" },
      tagPrefix: isBeta ? "beta-" : "",
      prerelease: true,
      draft: true,
    }),
    new PublisherS3({
      bucket: R2_BUCKET,
      region: R2_DEFAULT_REGION,
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
      endpoint: R2_ENDPOINT,
      keyResolver(fileName) {
        return `${prefix}/${fileName}`;
      },
      public: true,
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
