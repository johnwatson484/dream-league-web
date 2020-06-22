const joi = require('@hapi/joi')
const envs = ['development', 'test', 'production']

// Define config schema
const schema = joi.object().keys({
  port: joi.number().default(3003),
  env: joi.string().valid(...envs).default(envs[0]),
  appName: joi.string(),
  apiGatewayHost: joi.string().default('http://localhost:3001'),
  loginHost: joi.string().default('http://localhost:3002')
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  appName: 'Dream League',
  apiGatewayHost: process.env.API_GATEWAY_HOST,
  loginHost: process.env.LOGIN_HOST
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

module.exports = value
