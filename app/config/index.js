const joi = require('@hapi/joi')
const envs = ['development', 'test', 'production']

// Define config schema
const schema = joi.object().keys({
  port: joi.number().default(3001),
  env: joi.string().valid(...envs).default(envs[0]),
  appName: joi.string(),
  jwtConfig: joi.object({
    secret: joi.string()
  }),
  apiHost: joi.string().default('http://localhost:3000'),
  cookieOptions: joi.object({
    ttl: joi.number().default(60 * 60 * 1000),
    encoding: joi.string().valid('none').default('none'),
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
  appName: 'Dream League',
  jwtConfig: {
    secret: process.env.JWT_SECRET
  },
  apiHost: process.env.API_HOST,
  cookieOptions: {
    ttl: 60 * 60 * 1000,
    encoding: 'none',
    isSecure: process.env.NODE_ENV === 'production',
    isHttpOnly: true,
    clearInvalid: false,
    strictHeader: true
  }
}

// Validate config
const { error, value } = schema.validate(config)

value.isDev = value.env === 'development'

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

module.exports = value
