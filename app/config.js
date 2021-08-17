const joi = require('joi')
const envs = ['development', 'test', 'production']

// Define config schema
const schema = joi.object().keys({
  port: joi.number().default(3000),
  env: joi.string().valid(...envs).default(envs[0]),
  appName: joi.string().default('Dream League'),
  jwtConfig: joi.object({
    secret: joi.string()
  }),
  apiHost: joi.string().default('http://localhost:3001'),
  cookieOptions: joi.object({
    ttl: joi.number().default(1000 * 60 * 60 * 24 * 365),
    encoding: joi.string().valid('base64json').default('base64json'),
    isSameSite: joi.string().valid('Lax').default('Lax'),
    isSecure: joi.bool().default(true),
    isHttpOnly: joi.bool().default(true),
    clearInvalid: joi.bool().default(false),
    strictHeader: joi.bool().default(true)
  })
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  appName: process.env.APP_NAME,
  jwtConfig: {
    secret: process.env.JWT_SECRET
  },
  apiHost: process.env.API_HOST,
  cookieOptions: {
    ttl: process.env.COOKIE_TTL,
    encoding: process.env.COOKIE_ENCODING,
    isSameSite: process.env.COOKIE_SAME_SITE,
    isSecure: process.env.NODE_ENV === 'production',
    isHttpOnly: process.env.COOKIE_HTTP_ONLY,
    clearInvalid: process.env.COOKIE_CLEAR_INVALID,
    strictHeader: process.env.COOKIE_STRICT_HEADER
  }
}

// Validate config
const { error, value } = schema.validate(config)

value.isDev = value.env === 'development'
value.cookieOptionsIdentity = {
  ...value.cookieOptions,
  ttl: 1000 * 60 * 60 * 24 * 30,
  encoding: 'none'
}

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

module.exports = value
