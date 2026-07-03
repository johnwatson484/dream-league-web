import { readFileSync } from 'node:fs'
import path from 'node:path'
import nunjucks from 'nunjucks'
import vision from '@hapi/vision'
import config from '../config.js'

const manifestPath = path.resolve(import.meta.dirname, '../../.public/assets-manifest.json')

let manifest
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
} catch {
  throw new Error(`Vite manifest not found at ${manifestPath} — run npm run build:frontend first`)
}

function asset (logicalPath) {
  const entry = manifest[logicalPath]
  if (!entry) {
    throw new Error(`Asset not found in Vite manifest: ${logicalPath}`)
  }
  return `/assets/${entry.file}`
}

function assetCss (logicalPath) {
  const entry = manifest[logicalPath]
  if (!entry || !entry.css) {
    return []
  }
  return entry.css.map(f => `/assets/${f}`)
}

export default {
  plugin: vision,
  options: {
    engines: {
      njk: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)

          return (context) => {
            return template.render(context)
          }
        },
        prepare: (options, next) => {
          options.compileOptions.environment = nunjucks.configure(path.join(options.relativeTo || process.cwd(), options.path), {
            autoescape: true,
            watch: false,
          })

          return next()
        },
      },
    },
    path: '../views',
    relativeTo: import.meta.dirname,
    isCached: !config.isDev,
    context: {
      asset,
      assetCss,
      appName: config.appName,
    },
  },
}
