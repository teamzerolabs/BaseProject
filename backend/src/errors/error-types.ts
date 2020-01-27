import { WError } from 'verror'

/**
 * Default response details to send to client on errors
 */
import * as VError from 'verror'

export const DEFAULT_ERROR_MESSAGE = 'An unexpected error has occurred'

export enum ErrorCode {
  InvalidRequest = 'InvalidRequest',
  DatabaseError = 'DatabaseError',
  Timeout = 'Timeout',
  NotFound = 'NotFound',
  Unauthorized = 'Unauthorized',
  Unhealthy = 'Unhealthy',
  PrometheusFailure = 'PrometheusFailure',
  Internal = 'Internal',
}

export class ErrorResponse {
  requestId: string
  statusCode: number
  timestamp: string
  path: string
  error: {
    code: string
    message: string
    data: any
  }
}

export type VErrorCodeOptions = VError.Options & {
  info: { client: { message: string | null } }
}

export class VErrorCode<T extends ErrorCode> extends VError {
  public name: string
  public message: string
  public options: VErrorCodeOptions

  protected constructor(
    public readonly code: T,
    options: VErrorCodeOptions,
    debugMessage: string
  ) {
    super(
      { ...options, name: code },
      debugMessage || options.info.client.message || ''
    )

    this.options = { ...options, name: code }
  }

  clone(debugMessage: string): VErrorCode<T> {
    return new VErrorCode(
      this.code,
      { ...this.options, cause: this },
      debugMessage
    )
  }

  static errorWithContext<R extends ErrorCode>(
    error: Error | VErrorCode<R>,
    debugMessage: string
  ): VErrorCode<R | ErrorCode.Internal> {
    if (error instanceof VErrorCode) {
      return error.clone(debugMessage)
    }

    return new InternalException(debugMessage, error)
  }

  static addContext<R extends ErrorCode>(
    debugMessage: string
  ): (error: Error | VErrorCode<R>) => never {
    return (error: Error | VErrorCode<R>): never => {
      if (error instanceof VErrorCode) {
        throw error.clone(debugMessage)
      }

      throw new InternalException(debugMessage, error)
    }
  }

  static isCode(error: Error, ...codes: ErrorCode[]): boolean {
    return !!codes.find((code) =>
      error instanceof VErrorCode ? error.code === code : false
    )
  }

  toString(): string {
    new WError()
    return `${VError.fullStack(this)} metadata=${JSON.stringify(
      VError.info(this)
    )}`
  }
}

// less verbose way to call withContext
export function addContext<R extends ErrorCode>(
  debugMessage: string
): (error: Error | VErrorCode<R>) => never {
  return VErrorCode.addContext(debugMessage)
}

// This has to be defined here to prevent circular imports. VErrorCode is used
// by this class and InternalException is used by VErrorCode
export class InternalException extends VErrorCode<ErrorCode.Internal> {
  constructor(debugMessage: string, cause: Error | null = null) {
    super(
      ErrorCode.Internal,
      {
        cause,
        info: {
          client: {
            message: DEFAULT_ERROR_MESSAGE,
          },
        },
      },
      debugMessage
    )
  }

  clone(debugMessage: string): InternalException {
    return new InternalException(debugMessage, this)
  }
}

export * from './InvalidRequestException'
export * from './DatabaseErrorException'
export * from './NotFoundException'
export * from './PrometheusFailureException'
export * from './TimeoutException'
export * from './UnauthorizedException'
export * from './UnhealthyException'
export * from './ValidationFailedException'
