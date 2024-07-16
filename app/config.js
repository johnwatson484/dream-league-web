const Joi = require('joi')
const envs = ['development', 'test', 'production']

const schema = Joi.object().keys({
  port: Joi.number().default(3000),
  env: Joi.string().valid(...envs).default(envs[0]),
  appName: Joi.string().default('Dream League'),
  jwtConfig: Joi.object({
    secret: Joi.string(),
  }),
  apiHost: Joi.string().default('http://localhost:3001'),
  cookieOptions: Joi.object({
    ttl: Joi.number().default(1000 * 60 * 60 * 24 * 365), // 1 year
    encoding: Joi.string().valid('base64json').default('base64json'),
    isSameSite: Joi.string().valid('Lax').default('Lax'),
    isSecure: Joi.bool().default(true),
    isHttpOnly: Joi.bool().default(true),
    clearInvalid: Joi.bool().default(false),
    strictHeader: Joi.bool().default(true),
  }),
})

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  appName: process.env.APP_NAME,
  jwtConfig: {
    secret: process.env.JWT_SECRET,
  },
  apiHost: process.env.API_HOST,
  cookieOptions: {
    ttl: process.env.COOKIE_TTL,
    encoding: process.env.COOKIE_ENCODING,
    isSameSite: process.env.COOKIE_SAME_SITE,
    isSecure: process.env.NODE_ENV === 'production',
    isHttpOnly: process.env.COOKIE_HTTP_ONLY,
    clearInvalid: process.env.COOKIE_CLEAR_INVALID,
    strictHeader: process.env.COOKIE_STRICT_HEADER,
  },
}

const { error, value } = schema.validate(config)

value.isDev = value.env === 'development'
value.cookieOptionsIdentity = {
  ...value.cookieOptions,
  ttl: 1000 * 60 * 60 * 24 * 30, // 30 days
  encoding: 'none',
}

if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

module.exports = value
