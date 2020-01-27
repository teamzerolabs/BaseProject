import * as typeorm from 'typeorm'
import { QueryRunner } from 'typeorm'
import { PlatformTools } from 'typeorm/platform/PlatformTools'
import * as winston from 'winston'
import { isError, truncate } from './index'

export type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug'

const format = winston.format.printf((info) => {
  const message = isError(info) ? info : info.message

  const label = info.id ? info.id : 'no context'

  const duration =
    info.durationMs !== undefined ? `duration=${info.durationMs}ms` : ''
  return `${info.timestamp} [${label}] ${info.level}: ${message} ${duration}`
})

const appendTimestamp = winston.format((info, opts) => {
  info.timestamp = new Date().toISOString()
  return info
})

export const transports = {
  console: new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'info',
  }),
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.label({ label: 'main' }),
    appendTimestamp(),
    format
  ),
  transports: [transports.console],
})

export class TypeORMLogger implements typeorm.Logger {
  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner
  ): any {
    logger.verbose(`${level}: ${message}`)
  }

  logMigration(message: string, queryRunner?: QueryRunner): any {
    logger.verbose(message)
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    const sql =
      query +
      (parameters && parameters.length
        ? ' -- PARAMETERS: ' + JSON.stringify(parameters)
        : '')

    logger.verbose(`query=${PlatformTools.highlightSql(sql)}`)
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ): any {
    const sql =
      query +
      (parameters && parameters.length
        ? ' -- PARAMETERS: ' + JSON.stringify(parameters)
        : '')

    logger.verbose(`Query failed -
error=${error}
query=${PlatformTools.highlightSql(sql)}`)
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ): any {
    const sql =
      query +
      (parameters && parameters.length
        ? ' -- PARAMETERS: ' + JSON.stringify(parameters)
        : '')

    logger.verbose(`Query slow -
execution time=${time}
query=${PlatformTools.highlightSql(sql)}`)
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    logger.verbose(message)
  }
}
