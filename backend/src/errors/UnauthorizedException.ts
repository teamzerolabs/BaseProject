import { ErrorCode, VErrorCode } from './error-types'

export class UnauthorizedException extends VErrorCode<ErrorCode.Unauthorized> {
  constructor(
    debugMessage: string,
    private clientMessage: string,
    cause: Error | null = null
  ) {
    super(
      ErrorCode.Unauthorized,
      {
        cause,
        info: {
          client: {
            message: clientMessage,
          },
        },
      },
      debugMessage
    )
  }

  clone(debugMessage: string): VErrorCode<ErrorCode.Unauthorized> {
    return new UnauthorizedException(debugMessage, this.clientMessage, this)
  }
}
