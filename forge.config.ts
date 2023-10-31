import dotenv from "dotenv";
import path from "path";

import { MakerDMG } from "@electron-forge/maker-dmg";
import { DMGContents } from "@electron-forge/maker-dmg/dist/Config";
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

// aws
const AWS_ACCESS_KEY_ID = process.env["AWS_ACCESS_KEY_ID"] ?? "";
const AWS_SECRET_ACCESS_KEY = process.env["AWS_SECRET_ACCESS_KEY"] ?? "";
const AWS_DEFAULT_REGION = process.env["AWS_DEFAULT_REGION"] ?? "";
const AWS_BUCKET = process.env["AWS_BUCKET"] ?? "boxhero-autoupdate";

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
            tool: "notarytool",
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
      macUpdateManifestBaseUrl: `https://${AWS_BUCKET}.s3.${AWS_DEFAULT_REGION}.amazonaws.com/${prefix}`,
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
      /**
       * NOTE: electron-installer-dmg가 DMGContents에 name prop을 필수로 지정하게 강제함.
       * 하지만 지정할 경우 앱 아이콘 등이 정상적으로 표시되지 않는다.
       * electron-installer-dmg가 의존하고 있는 appdmg 패키지는 정작 name가 optional이고 예시에서도 사용안함.
       * 타입 정의가 잘 못 되어있는 경우로 판단됨.
       * TODO: 이후 electron-installer-dmg가 수정되면 타입 단언을 제거할 것.
       */
      contents: [
        {
          type: "file",
          path: `${process.cwd()}/out/BoxHero-darwin-universal/BoxHero.app`,
          x: 164,
          y: 200,
        },
        {
          type: "link",
          path: "/Applications",
          x: 409,
          y: 200,
        },
      ] as unknown as DMGContents[],
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
      bucket: AWS_BUCKET,
      region: AWS_DEFAULT_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
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
