import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  esbuild:{
    treeShaking:false
  },
  build:{
    rollupOptions:{
      treeshake:false,
      input: './src/main'
    },
    manifest:true,
  }
})
