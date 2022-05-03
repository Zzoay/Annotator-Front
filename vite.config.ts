import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

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
  // base: './'
})