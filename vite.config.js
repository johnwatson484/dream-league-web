import path from 'node:path'
import { cp } from 'node:fs/promises'
import { defineConfig } from 'vite'

const dirname = import.meta.dirname

export default defineConfig(({ mode }) => ({
  root: path.resolve(dirname, 'src/client'),
  base: '/assets/',
  build: {
    outDir: path.resolve(dirname, '.public'),
    emptyOutDir: true,
    manifest: 'assets-manifest.json',
    sourcemap: mode === 'production' ? true : 'inline',
    rollupOptions: {
      input: {
        'bootstrap-custom': path.resolve(dirname, 'src/client/stylesheets/bootstrap-custom.css'),
        application: path.resolve(dirname, 'src/client/stylesheets/application.scss'),
        cookies: path.resolve(dirname, 'src/client/javascripts/cookies.js'),
        'file-input': path.resolve(dirname, 'src/client/javascripts/file-input.js'),
        'global-search': path.resolve(dirname, 'src/client/javascripts/global-search.js'),
        'google-analytics': path.resolve(dirname, 'src/client/javascripts/google-analytics.js'),
        manager: path.resolve(dirname, 'src/client/javascripts/manager.js'),
        'results-edit': path.resolve(dirname, 'src/client/javascripts/results-edit.js'),
        results: path.resolve(dirname, 'src/client/javascripts/results.js'),
        teamsheet: path.resolve(dirname, 'src/client/javascripts/teamsheet.js'),
      },
      output: {
        entryFileNames: mode === 'production'
          ? 'javascripts/[name].[hash:7].min.js'
          : 'javascripts/[name].js',
        chunkFileNames: mode === 'production'
          ? 'javascripts/[name].[hash:7].min.js'
          : 'javascripts/[name].js',
        assetFileNames: ({ names }) => {
          const name = names[0] ?? ''
          if (/\.css$/.test(name)) {
            return mode === 'production'
              ? 'stylesheets/[name].[hash:7].min.css'
              : 'stylesheets/[name].css'
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(name)) {
            return 'assets/fonts/[name][extname]'
          }
          return 'images/[name][extname]'
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        sourceMapIncludeSources: true,
      },
    },
  },
  plugins: [
    {
      name: 'copy-static-assets',
      apply: 'build',
      async writeBundle () {
        await cp(
          path.resolve(dirname, 'src/client/images'),
          path.resolve(dirname, '.public/images'),
          { recursive: true }
        )
      },
    },
  ],
}))
