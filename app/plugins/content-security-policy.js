const Blankie = require('blankie')

module.exports = {
  plugin: Blankie,
  options: {
    fontSrc: ['self', 'fonts.gstatic.com', '*.cloudflare.com', '*.fontawesome.com'],
    imgSrc: ['self', '*.google.com'],
    scriptSrc: ['self', 'unsafe-inline', 'code.jquery.com', 'cdnjs.cloudflare.com', '*.bootstrapcdn.com', '*.fontawesome.com', '*.googletagmanager.com', '*.google.com'],
    styleSrc: ['self', 'unsafe-inline', 'fonts.googleapis.com', '*.bootstrapcdn.com', 'cdnjs.cloudflare.com', 'code.jquery.com'],
    connectSrc: ['self', '*.fontawesome.com'],
    frameAncestors: ['self'],
    formAction: ['self'],
    generateNonces: false,
  },
}
