import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:3000",
  //       changeOrigin: true, // 允许跨域
  //       rewrite: (path) => path.replace(/^\/api/, ""), // 如果后端接口没有 /api 前缀，需要重写
  //     },
  //   },
  // },
});
