import { defineConfig } from 'vite'
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue'
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
function pathResolve(dir: string): string {
  return resolve(process.cwd(), '.', dir)
};
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()],
    })
  ],
  resolve: {
    alias: {
      '@': pathResolve('src')
    }
  },
  server: {
    host: '0.0.0.0', //ip地址
    port: 5174, //端口号
    open: false, //启动后是否自动打开浏览器j
    proxy:{
      "/api": {
        target:
          "https://d.cess.cloud/",
        changeOrigin: true, //是否跨域
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    }
  }
})
