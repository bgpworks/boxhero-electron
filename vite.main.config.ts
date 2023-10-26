import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    browserField: false,
    mainFields: ["module", "jsnext:main", "jsnext"],
  },
  plugins: [EnvironmentPlugin("all", { prefix: "DEV_" })],
});
