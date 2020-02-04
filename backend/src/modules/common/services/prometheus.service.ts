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
import { PackageType } from '../types/package.type'
import { readFileSync } from 'fs'

export const PROMETHEUS_PREFIX: string = config.prometheus.prefix

@Injectable()
export class PrometheusService {
  private readonly exceptionCounter: Counter
  private readonly unhandledRejectionCounter: Counter
  private readonly packageCounter: Counter

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

    this.packageCounter = new Counter({
      name: `${PROMETHEUS_PREFIX}_packages_installed`,
      help: 'packages installed for this project',
      labelNames: ['package_type', 'package_name', 'package_version'],
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

  private getIndividualPackageVersions(
    packageName: string
  ): string | undefined {
    let version = undefined
    try {
      const loadedPackageJson = JSON.parse(
        readFileSync(`./node_modules/${packageName}/package.json`).toString(
          'utf-8'
        )
      )
      if (loadedPackageJson.version) {
        version = loadedPackageJson.version
      }
    } catch (err) {
      logger.info(
        `Cannot locate package info for sub-packages ${packageName}: ${err.message}`
      )
    }
    return version
  }

  logPackages(packJson: PackageType) {
    for (const packageName in packJson.devDependencies) {
      this.packageCounter.inc({
        package_type: 'dev-dep',
        package_name: packageName,
        package_version:
          this.getIndividualPackageVersions(packageName) ||
          packJson.devDependencies[packageName],
      })
    }
    for (const packageName in packJson.dependencies) {
      this.packageCounter.inc({
        package_type: 'dep',
        package_name: packageName,
        package_version:
          this.getIndividualPackageVersions(packageName) ||
          packJson.dependencies[packageName],
      })
    }
  }
}
