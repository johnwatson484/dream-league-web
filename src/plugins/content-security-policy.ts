import Blankie from 'blankie'
import config from '../config.ts'

export default {
  plugin: Blankie,
  options: {
    fontSrc: ['self', 'fonts.gstatic.com', '*.cloudflare.com', '*.fontawesome.com'],
    imgSrc: ['self', '*.google.com', '*.google-analytics.com', '*.gstatic.com'],
    scriptSrc: [
      'self',
      'code.jquery.com',
      'cdnjs.cloudflare.com',
      '*.bootstrapcdn.com',
      '*.googletagmanager.com',
      '*.google.com',
      '*.google-analytics.com',
      '*.fontawesome.com',
    ],
    styleSrc: ['self', 'unsafe-inline', 'fonts.googleapis.com', '*.bootstrapcdn.com', 'cdnjs.cloudflare.com', 'code.jquery.com'],
    connectSrc: [
      'self',
      '*.bootstrapcdn.com',
      'cdnjs.cloudflare.com',
      '*.fontawesome.com',
      '*.google-analytics.com',
      '*.analytics.google.com',
      '*.googletagmanager.com',
      config.get('videprinterHost'),
    ],
    frameAncestors: ['self'],
    formAction: ['self'],
    generateNonces: false,
  },
}
