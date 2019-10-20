import { ErrorCode, VErrorCode } from './error-types'

export class TimeoutException extends VErrorCode<ErrorCode.Timeout> {
  constructor(debugMessage: string, cause: Error | null = null) {
    super(
      ErrorCode.Timeout,
      {
        cause,
        info: {
          client: {
            message: 'Timeout',
          },
        },
      },
      debugMessage
    )
  }

  clone(debugMessage: string): VErrorCode<ErrorCode.Timeout> {
    return new TimeoutException(debugMessage, this)
  }
}
