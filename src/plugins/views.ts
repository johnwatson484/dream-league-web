import { readFileSync } from 'node:fs'
import path from 'node:path'
import nunjucks from 'nunjucks'
import vision from '@hapi/vision'
import type { Request } from '@hapi/hapi'
import config from '../config.ts'
import { mapAuth } from '../auth/map-auth.ts'

const manifestPath = path.resolve(import.meta.dirname, '../../.public/assets-manifest.json')

interface ManifestEntry {
  file: string
  css?: string[]
}

let manifest: Record<string, ManifestEntry>
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, ManifestEntry>
} catch {
  throw new Error(`Vite manifest not found at ${manifestPath} — run npm run build:frontend first`)
}

function asset (logicalPath: string): string {
  const entry = manifest[logicalPath] || manifest[logicalPath.replace(/\.js$/, '.ts')]
  if (!entry) {
    throw new Error(`Asset not found in Vite manifest: ${logicalPath}`)
  }
  return `/assets/${entry.file}`
}

function assetCss (logicalPath: string): string[] {
  const entry = manifest[logicalPath] || manifest[logicalPath.replace(/\.js$/, '.ts')]
  if (!entry?.css) {
    return []
  }
  return entry.css.map((f: string) => `/assets/${f}`)
}

function context (request: Request): Record<string, unknown> {
  const ctx = (request.response as unknown as { source?: { context?: Record<string, unknown> } }).source?.context || {}
  return {
    ...ctx,
    asset,
    assetCss,
    appName: config.get('appName'),
    currentYear: new Date().getUTCFullYear(),
    auth: mapAuth(request),
    cookiesPolicy: request.state?.cookies_policy || { confirmed: false, essential: true, analytics: false },
  }
}

export default {
  plugin: vision,
  options: {
    engines: {
      njk: {
        compile: (src: string, options: { environment: unknown }) => {
          const template = nunjucks.compile(src, options.environment)
          return (ctx: Record<string, unknown>) => template.render(ctx)
        },
        prepare: (options: { compileOptions: { environment?: unknown }; relativeTo?: string; path: string }, next: () => void) => {
          const env = nunjucks.configure(path.join(options.relativeTo || process.cwd(), options.path), {
            autoescape: true,
            watch: false,
          })
          env.addFilter('date', (value: string | Date) => {
            const d = new Date(value)
            if (Number.isNaN(d.getTime())) { return String(value) }
            const day = String(d.getDate()).padStart(2, '0')
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const year = d.getFullYear()
            const hours = String(d.getHours()).padStart(2, '0')
            const minutes = String(d.getMinutes()).padStart(2, '0')
            return `${day}/${month}/${year} ${hours}:${minutes}`
          })
          options.compileOptions.environment = env
          return next()
        },
      },
    },
    path: '../views',
    relativeTo: import.meta.dirname,
    isCached: !config.get('isDev'),
    context,
  },
}
