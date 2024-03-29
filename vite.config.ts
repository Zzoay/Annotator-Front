import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: '@import "src/assets/scss/globalVariable.scss";'
      }
    }
  },
  resolve: {
    alias: {
        "@": resolve(__dirname, 'src'), // 路径别名
    },
    extensions: ['.js', '.json', '.ts'] // 使用路径别名时想要省略的后缀名，可以自己 增减
  },
  // base: './',
  // // 反向代理配置 - 可解决跨域问题
  server:{
    proxy: { 
      '/api': {
       target: "http://localhost:8000",
       changeOrigin: true,
      //  rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})