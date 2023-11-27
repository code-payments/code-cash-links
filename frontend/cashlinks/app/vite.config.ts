import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const path = require('path')

require('dotenv').config();

const dev = {
  WS_PATH: 'ws://localhost:3000',
  HTTP_PATH: 'http://localhost:3000',
}

let env : any = {};
if (process.env.NODE_ENV === 'production') {
  console.warn('Using production environment');
} else {
  console.warn('Using dev environment');
  env = dev;
}

if (process.env.BUGSNAG_KEY) {
  env.BUGSNAG_KEY = process.env.BUGSNAG_KEY;
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/app/',
  plugins: [
    vue(),
  ],
  root: path.resolve(__dirname, './'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      crypto: 'crypto-browserify',
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
    },
  },
  define: {
    'process.env': env,
    'process.browser': true,
    'global': {}
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
  server: {
    port: 8770,
  },
})
