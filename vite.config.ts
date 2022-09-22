import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueSetupExtend()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      comp: path.resolve(__dirname, "src/components"),
      views: path.resolve(__dirname, "src/views"),
      store: path.resolve(__dirname, "src/store"),
      api: path.resolve(__dirname, "src/api"),
      assets: path.resolve(__dirname, "src/assets"),
    },
  },
  server: {
    //使用IP能访问
    host: "0.0.0.0",
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import 'assets/styles/_variables.scss';`,
      },
    },
  },
  build: {
    sourcemap: true,
  },
});
