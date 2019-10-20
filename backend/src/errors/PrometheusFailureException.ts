import { DEFAULT_ERROR_MESSAGE, ErrorCode, VErrorCode } from './error-types'

export class PrometheusFailureException extends VErrorCode<
  ErrorCode.PrometheusFailure
> {
  constructor(debugMessage: string, cause: Error | null = null) {
    super(
      ErrorCode.PrometheusFailure,
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

  clone(debugMessage: string): VErrorCode<ErrorCode.PrometheusFailure> {
    return new PrometheusFailureException(debugMessage, this)
  }
}
