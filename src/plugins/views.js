import path from 'node:path'
import nunjucks from 'nunjucks'
import vision from '@hapi/vision'
import config from '../config.js'

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
      assetPath: '/assets',
      appName: config.appName,
    },
  },
}
