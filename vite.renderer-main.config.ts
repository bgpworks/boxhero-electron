import path from "node:path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "./templates/main.html"),
      },
    },
  },
  plugins: [svgr()],
});
