import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  //为src添加别名
  resolve: {
    alias: {
      "@": "/src",
    },
  },
})
