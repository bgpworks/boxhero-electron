import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config
export default defineConfig({
  define: {
    __ENABLE_GOTO_DEEP_LINK__:
      process.env.NODE_ENV === "development" ||
      process.env.DEV_USE_BETA_LANE === "t",
  },
  build: {
    minify: process.env.NODE_ENV !== "development",
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
      fileName: () => "[name].js",
    },
  },
  resolve: {
    mainFields: ["module", "jsnext:main", "jsnext"],
  },
  plugins: [
    EnvironmentPlugin("all", { prefix: "DEV_" }),
    EnvironmentPlugin(["FEED_BASE_URL"]),
  ],
});
