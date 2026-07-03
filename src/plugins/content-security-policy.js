import Blankie from 'blankie'

export default {
  plugin: Blankie,
  options: {
    fontSrc: ['self', 'fonts.gstatic.com'],
    imgSrc: ['self', '*.google.com', '*.google-analytics.com', '*.gstatic.com'],
    scriptSrc: [
      'self',
      'code.jquery.com',
      'cdnjs.cloudflare.com',
      '*.bootstrapcdn.com',
      '*.googletagmanager.com',
      '*.google.com',
      '*.google-analytics.com',
    ],
    styleSrc: ['self', 'unsafe-inline', 'fonts.googleapis.com', '*.bootstrapcdn.com', 'cdnjs.cloudflare.com', 'code.jquery.com'],
    connectSrc: [
      'self',
      '*.bootstrapcdn.com',
      '*.google-analytics.com',
      '*.analytics.google.com',
      '*.googletagmanager.com',
    ],
    frameAncestors: ['self'],
    formAction: ['self'],
    generateNonces: false,
  },
}
