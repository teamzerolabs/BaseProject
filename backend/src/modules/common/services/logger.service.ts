import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { logger } from '../../../util/logger'

@Injectable({ scope: Scope.REQUEST })
export class LoggerService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  info(message: string, meta?: {}) {
    return this.log('info', message, meta)
  }

  error(message: string, meta?: {}) {
    return this.log('error', message, meta)
  }

  warn(message: string, meta?: {}) {
    return this.log('warn', message, meta)
  }

  verbose(message: string, meta?: {}) {
    return this.log('verbose', message, meta)
  }

  debug(message: string, meta?: {}) {
    return this.log('debug', message, meta)
  }

  log(
    level: 'info' | 'error' | 'warn' | 'verbose' | 'debug',
    message: string,
    meta: {} = {}
  ) {
    logger.log(level, message, { ...meta, id: this.request.context.id })
  }
}
