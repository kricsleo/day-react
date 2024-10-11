import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
// import { UnoCSSRspackPlugin } from '@unocss/webpack/rspack'

export default defineConfig({
  html: {
    template: './public/index.html',
  },

  source: {
    entry: {
      index: './src/main.tsx',
    },
  },

  performance: {
    chunkSplit: {
      // strategy: 'split-by-experience',
      // strategy: 'split-by-size',
      // minSize: 30 * 1024,
      // maxSize: 50 * 1024,
      forceSplitting: {
        'framer-motion': /framer-motion/,
        'react': /react/,
      },
    },
  },

  plugins: [
    pluginReact(),
  ],
  // tools: {
  //   rspack(config, ctx) {
  //     ctx.prependPlugins(UnoCSSRspackPlugin())
  //     config.optimization ??= {}
  //     config.optimization.realContentHash = true
  //   },
  // },
})
