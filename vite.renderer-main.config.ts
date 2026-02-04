import path from "node:path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const boxheroUrl = "https://app.boxhero.io/";

// https://vitejs.dev/config
export default defineConfig({
  define: {
    __BOXHERO_URL__: JSON.stringify(boxheroUrl),
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "./templates/main.html"),
      },
    },
  },
  plugins: [svgr()],
});
