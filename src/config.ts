import convict from 'convict'
import convictFormatWithValidator from 'convict-format-with-validator'

convict.addFormats(convictFormatWithValidator)

convict.addFormat({
  name: 'required-string',
  validate: (val) => {
    if (!val || val.length < 32) {
      throw new Error('must be at least 32 characters')
    }
  },
  coerce: (val) => val,
})

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  isDev: {
    doc: 'True if the application is in development mode.',
    format: Boolean,
    default: process.env.NODE_ENV === 'development',
  },
  isSecure: {
    doc: 'True if cookies should be secure (production only).',
    format: Boolean,
    default: process.env.NODE_ENV === 'production',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  appName: {
    doc: 'The name of the application.',
    format: String,
    default: 'Dream League',
    env: 'APP_NAME',
  },
  apiHost: {
    doc: 'The backend API base URL.',
    format: 'url',
    default: 'http://localhost:3001',
    env: 'API_HOST',
  },
  session: {
    cookieName: {
      doc: 'The session cookie name.',
      format: String,
      default: 'dl_session',
      env: 'COOKIE_NAME',
    },
    cookiePassword: {
      doc: 'The session cookie encryption password (min 32 chars).',
      format: 'required-string',
      default: '',
      env: 'COOKIE_PASSWORD',
      sensitive: true,
    },
    ttl: {
      doc: 'Session TTL in milliseconds.',
      format: Number,
      default: 1000 * 60 * 60 * 24 * 7,
      env: 'SESSION_TTL',
    },
  },
  cookie: {
    ttl: {
      doc: 'Cookie consent TTL in milliseconds.',
      format: Number,
      default: 1000 * 60 * 60 * 24 * 365,
      env: 'COOKIE_TTL',
    },
    encoding: {
      doc: 'Cookie encoding format.',
      format: ['none', 'base64', 'base64json', 'iron'],
      default: 'base64json',
      env: 'COOKIE_ENCODING',
    },
    isSameSite: {
      doc: 'Cookie SameSite attribute.',
      format: ['Lax', 'Strict', 'None'],
      default: 'Lax',
      env: 'COOKIE_SAME_SITE',
    },
    isHttpOnly: {
      doc: 'Cookie HttpOnly flag.',
      format: Boolean,
      default: true,
      env: 'COOKIE_HTTP_ONLY',
    },
    clearInvalid: {
      doc: 'Clear invalid cookies.',
      format: Boolean,
      default: false,
      env: 'COOKIE_CLEAR_INVALID',
    },
    strictHeader: {
      doc: 'Strict cookie header enforcement.',
      format: Boolean,
      default: true,
      env: 'COOKIE_STRICT_HEADER',
    },
  },
  redis: {
    host: {
      doc: 'Redis host for session storage.',
      format: String,
      default: 'localhost',
      env: 'REDIS_HOST',
    },
    port: {
      doc: 'Redis port for session storage.',
      format: 'port',
      default: 6380,
      env: 'REDIS_PORT',
    },
    password: {
      doc: 'Redis authentication password.',
      format: String,
      default: '',
      env: 'REDIS_PASSWORD',
      sensitive: true,
    },
  },
})

config.validate({ allowed: 'strict' })

export default config
