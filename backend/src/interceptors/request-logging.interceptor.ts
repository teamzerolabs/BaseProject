import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Request } from 'express'
import { Histogram } from 'prom-client'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import * as VError from 'verror'
import { ErrorCode } from '../errors/error-types'
import { PrometheusService } from '../modules/common/services/prometheus.service'
import { logger } from '../util/logger'

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  requestHistograms: Histogram
  constructor(private readonly prometheusService: PrometheusService) {
    this.requestHistograms = this.prometheusService.createHistogram({
      name: `api_response_time`,
      help: `Time of responses in seconds`,
      labelNames: ['handler'],
      buckets: [0.03, 0.1, 0.3, 1.5, 10],
    })
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest()
    const contextId = request.context ? request.context.id : 'no context'

    try {
      const now = Date.now()

      logger.info(
        `
-------
REQUEST id=${contextId}
-------
${this.formatRequest(request)}`,
        {
          id: contextId,
        }
      )

      const end = this.requestHistograms.startTimer({
        handler: context.getHandler().name,
      })
      const requestStart = Date.now()
      return next.handle().pipe(
        tap((data) => {
          end()

          // For errors that get caught in the exception filter, data is an
          // observable for some reason
          if (!(data instanceof Observable)) {
            logger.verbose(
              `
--------
RESPONSE id=${contextId}
--------
${this.formatResponse(data, Date.now() - requestStart)}`,
              {
                id: contextId,
              }
            )
          }
        })
      )
    } catch (e) {
      logger.error(
        `Couldn't time request for prometheus due to error ${VError.fullStack(
          e
        )}`
      )
      this.prometheusService.exceptionLogged(ErrorCode.PrometheusFailure)
      return next.handle()
    }
  }

  private formatRequest(request: Request): string {
    return `${request.method} ${request.url}
clientId=${request.auth ? request.auth.sub : 'no client id'}

body=${JSON.stringify(request.body, null, 2)}
    `
  }

  private formatResponse(data: any, time: number): string {
    return `duration=${(time / 1000.0).toFixed(3)}s
    
body=${JSON.stringify(data, null, 2)}
    `
  }
}
