import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config
export default defineConfig({
  build: { minify: process.env.NODE_ENV !== "development" },
  resolve: {
    browserField: false,
    mainFields: ["module", "jsnext:main", "jsnext"],
  },
  plugins: [
    EnvironmentPlugin("all", { prefix: "DEV_" }),
    EnvironmentPlugin(["AWS_BUCKET", "AWS_DEFAULT_REGION"]),
  ],
});
