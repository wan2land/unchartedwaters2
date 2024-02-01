import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    preact(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/js-dos/dist/*",
          dest: "static/js-dos",
        },
        {
          src: "game/*",
          dest: "static/game",
        },
      ],
    }),
  ],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});
