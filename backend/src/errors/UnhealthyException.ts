import { DEFAULT_ERROR_MESSAGE, ErrorCode, VErrorCode } from './error-types'

export class UnhealthyException extends VErrorCode<ErrorCode.Unhealthy> {
  constructor(debugMessage: string, cause: Error | null = null) {
    super(
      ErrorCode.Unhealthy,
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

  clone(debugMessage: string): VErrorCode<ErrorCode.Unhealthy> {
    return new UnhealthyException(debugMessage, this)
  }
}
