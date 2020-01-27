import { ErrorCode, VErrorCode } from './error-types'

export class NotFoundException extends VErrorCode<ErrorCode.NotFound> {
  constructor(
    debugMessage: string,
    private clientMessage: string,
    cause: Error | null = null
  ) {
    super(
      ErrorCode.NotFound,
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

  clone(debugMessage: string): VErrorCode<ErrorCode.NotFound> {
    return new NotFoundException(debugMessage, this.clientMessage, this)
  }
}
