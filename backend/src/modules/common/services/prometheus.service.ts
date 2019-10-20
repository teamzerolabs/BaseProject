import { Injectable } from '@nestjs/common'
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  HistogramConfiguration,
  register,
} from 'prom-client'
import config from '../../../config'
import { ErrorCode } from '../../../errors/error-types'
import { logger } from '../../../util/logger'

export const PROMETHEUS_PREFIX: string = config.prometheus.prefix

@Injectable()
export class PrometheusService {
  private readonly exceptionCounter: Counter
  private readonly unhandledRejectionCounter: Counter

  constructor() {
    this.exceptionCounter = new Counter({
      name: `${PROMETHEUS_PREFIX}_exceptions_logged_total`,
      help: '# of exceptions that have been processed in the exception filter',
      labelNames: ['code'],
    })
    this.unhandledRejectionCounter = new Counter({
      name: `${PROMETHEUS_PREFIX}_unhandled_exceptions_logged_total`,
      help: '# of exceptions that have been unhandled',
    })

    // collectDefaultMetrics({
    //   // timeout: 10 * 1000, --> probes every 10s by default
    //   prefix: `${PROMETHEUS_PREFIX}_`,
    // })
  }

  getMetrics(): string {
    return register.metrics()
  }

  /**
   * Logs that an exception has occurred by incrementing the exception counter
   */
  exceptionLogged(code: ErrorCode): void {
    try {
      logger.debug(`Logged exception with code=${code}`)
      this.exceptionCounter.inc({ code })
    } catch (e) {
      logger.error(e)
      this.exceptionLogged(ErrorCode.PrometheusFailure)
    }
  }

  unhandledRejectionLogged(): void {
    try {
      logger.debug(`Logged unhandled promise rejection`)
      this.unhandledRejectionCounter.inc()
    } catch (e) {
      logger.error(e)
      this.exceptionLogged(ErrorCode.PrometheusFailure)
    }
  }

  createHistogram(config: HistogramConfiguration) {
    return new Histogram({
      ...config,
      name: `${PROMETHEUS_PREFIX}_${config.name}`,
    })
  }
}
