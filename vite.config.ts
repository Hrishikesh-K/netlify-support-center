// noinspection JSUnusedGlobalSymbols

import {createHtmlPlugin} from 'vite-plugin-html'
import {defineConfig} from 'vite'
import {resolve} from 'path'
import svgLoader from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'
import windicss from 'vite-plugin-windicss'
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'chunks/[name].js',
        entryFileNames: 'entries/[name].js'
      }
    },
    sourcemap: true,
    target: 'esnext'
  },
  esbuild: {
    legalComments: 'none'
  },
  plugins: [createHtmlPlugin({
    minify: true
  }), svgLoader({
    svgo: false
  }), vue({
    reactivityTransform: true
  }), windicss()],
  resolve: {
    alias: {
      '~/client': resolve(__dirname, './src')
    }
  }
})