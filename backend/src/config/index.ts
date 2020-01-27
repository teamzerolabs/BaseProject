import { logger } from '../util/logger'
import {
  ConfigProperties,
  parseEnv,
  parseEnvBoolean,
  parseEnvNumber,
} from './util'
import * as dotenv from 'dotenv'

let env = process.env.NODE_ENV
if (env !== 'production') {
  // Development will use .env, anything else will use .env.<NODE_ENV>
  if (env === 'development') {
    env = ''
  }

  const path = `src/config/.env${env ? `.${env}` : ''}`
  logger.info(`Loading config from environment file ${path}`)
  dotenv.config({ path })
}

const config: ConfigProperties = {
  app: {
    name: parseEnv('BASE_PROJECT_NAME', 'base'),
    base_url: parseEnv('BASE_URL'),
    port: parseEnvNumber('PORT'),
  },
  jwt: {
    secret: parseEnv('JWT_SECRET', 'base_here'),
  },
  debug: {
    benchmark: parseEnvBoolean('DEBUG_BENCHMARK', false),
  },
  prometheus: {
    port: parseEnvNumber('PROMETHEUS_PORT', 9101),
    prefix: parseEnv('PROMETHEUS_PREFIX', 'base'),
  },
  mysql: {
    host: parseEnv('DATABASE_URL'),
    port: parseInt(parseEnv('DATABASE_PORT'), 10),
    username: parseEnv('DATABASE_USERNAME'),
    password: parseEnv('DATABASE_PASSWORD'),
    database: parseEnv('DATABASE_NAME'),
  },
}

export default config
