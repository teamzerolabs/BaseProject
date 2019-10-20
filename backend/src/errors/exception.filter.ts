import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  NotFoundException as NestNotFoundException,
} from '@nestjs/common'
import { Request } from 'express'
import * as VError from 'verror'
import { PrometheusService } from '../modules/common/services/prometheus.service'
import { uuidv4 } from '../util'
import { logger } from '../util/logger'
import {
  DEFAULT_ERROR_MESSAGE,
  ErrorCode,
  ErrorResponse,
  InternalException,
  NotFoundException,
  ValidationFailedException,
  VErrorCode,
} from './error-types'

/**
 * Catches Exceptions for logging and response mapping
 */
@Catch()
export class GeneralExceptionFilter implements ExceptionFilter<Error> {
  constructor(private readonly prometheusService: PrometheusService) {}

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request: any = ctx.getRequest()

    try {
      const requestId = request.context ? request.context.id : uuidv4()

      // Process exception into VError with code
      const exception = processException(error)
      const info = VError.info(exception)

      this.prometheusService.exceptionLogged(exception.code)

      const errorResponse: ErrorResponse = {
        requestId,
        statusCode: 400,
        timestamp: new Date().toISOString(),
        path: request.url,
        error: {
          code: exception.code,
          message: info.client.message || DEFAULT_ERROR_MESSAGE,
          data: info.client,
        },
      }

      logger.error(
        `[${request.method} ${request.url}] ${VError.fullStack(
          exception
        )} metadata=${JSON.stringify(VError.info(exception))}`,
        {
          id: requestId,
        }
      )

      response.status(errorResponse.statusCode).json(errorResponse)
    } catch (e) {
      logger.error(
        `Exception filter error, proper error code not sent to client: ${e.message} ${e.stack}`
      )
      // Absolute fallback case for any reason above code crashes
      response.status(500).json({
        requestId: null,
        statusCode: 500,
        timestamp: null,
        path: null,
        error: {
          code: ErrorCode.Internal,
          message: 'Internal server error',
        },
      })

      try {
        this.prometheusService.exceptionLogged(ErrorCode.Internal)
      } catch (e) {
        logger.error(
          `Could not set prometheus metric for critical error ${VError.fullStack(
            e
          )}`
        )
      }
    }
  }
}

/**
 * Converts all exceptions to VErrorCode exceptions with a code
 *
 * @param exception
 */
function processException(exception: Error): VErrorCode<ErrorCode> {
  if (exception instanceof NestNotFoundException) {
    return new NotFoundException(
      `Route not found ${JSON.stringify(exception.message)}`,
      `Route not found`,
      exception
    )
  } else if (exception instanceof BadRequestException) {
    return new ValidationFailedException(
      `NestJS validation exception`,
      'Request validation checks failed',
      exception.getResponse(),
      exception
    )
  } else if (exception instanceof HttpException) {
    return new InternalException(`NestJS HttpException`, exception)
  } else if (!(exception instanceof VErrorCode)) {
    return new InternalException('Unmatched exception caught', exception)
  }

  return exception
}
