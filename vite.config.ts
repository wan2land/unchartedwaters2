import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    preact(),
    viteStaticCopy({
      targets: [
        {
          src: "CNAME",
          dest: "",
        },
        {
          src: "static/*",
          dest: "static",
        },
        {
          src: "node_modules/js-dos/dist/*",
          dest: "static/js-dos",
        },
        {
          src: "node_modules/js-dos/dist/wdosbox.js",
          dest: "static/js-dos",
          transform: (content) =>
            content.replace(
              "bufferingDelay=50/1e3",
              "bufferingDelay=200/1e3",
            ),
        },
        {
          src: "node_modules/js-dos/dist/js-dos.js",
          dest: "static/js-dos",
          transform: (content) =>
            content
              .replace("blocksize=1024", "blocksize=4096")
              .replace("prebuffer=20", "prebuffer=100")
              .replace("pcspeaker=true", "pcspeaker=false"),
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
