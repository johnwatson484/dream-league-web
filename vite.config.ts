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
        cookies: path.resolve(dirname, 'src/client/javascripts/cookies.ts'),
        'file-input': path.resolve(dirname, 'src/client/javascripts/file-input.ts'),
        'global-search': path.resolve(dirname, 'src/client/javascripts/global-search.ts'),
        'google-analytics': path.resolve(dirname, 'src/client/javascripts/google-analytics.ts'),
        manager: path.resolve(dirname, 'src/client/javascripts/manager.ts'),
        'results-edit': path.resolve(dirname, 'src/client/javascripts/results-edit.ts'),
        results: path.resolve(dirname, 'src/client/javascripts/results.ts'),
        teamsheet: path.resolve(dirname, 'src/client/javascripts/teamsheet.ts'),
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
