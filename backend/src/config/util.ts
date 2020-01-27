import { isNullOrUndefined } from '../util'

export type ConfigProperties = {
  app: {
    name: string
    base_url: string
    port: number
  }
  jwt: {
    secret: string
  }
  prometheus: {
    port: number
    prefix: string
  }
  debug: {
    benchmark: boolean
  }
  mysql: {
    host: string
    port: number
    username: string
    password: string
    database: string
  }
}

/**
 * Retrieves environment variable and throws if missing without default
 *
 * @param name name of environment variable
 * @param defaultVal
 */
export function parseEnv(name: string, defaultVal?: string): string {
  let env = process.env[name]
  if (!env) {
    if (isNullOrUndefined(defaultVal)) {
      throw new Error(`Missing environment variable for ${name}`)
    }
    env = defaultVal
  }

  return env
}

/**
 * Retrieves environment variable as a number and throws if missing without default
 *
 * @param name name of environment variable
 * @param defaultVal
 */
export function parseEnvNumber(name: string, defaultVal?: number): number {
  return parseInt(parseEnv(name, `${defaultVal}`))
}

/**
 * Retrieves environment variable as a boolean and throws if missing without default
 *
 * @param name name of environment variable
 * @param defaultVal
 */
export function parseEnvBoolean(name: string, defaultVal?: boolean): boolean {
  return parseEnv(name, `${defaultVal}`).toLowerCase() === 'true'
}
