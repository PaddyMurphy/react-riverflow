import { defineConfig, lazyPlugins } from "vite-plus";
import react from "@vitejs/plugin-react";

// homepage is served from /react-riverflow on gh-pages
export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  base: "/react-riverflow/",
  plugins: lazyPlugins(() => [react()]),
  css: {
    preprocessorOptions: {
      sass: { quietDeps: true, silenceDeprecations: ["legacy-js-api"] },
      scss: { quietDeps: true, silenceDeprecations: ["legacy-js-api"] },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
});
