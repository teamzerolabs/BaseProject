import { ErrorCode, VErrorCode } from './error-types'

export class InvalidRequestException extends VErrorCode<
  ErrorCode.InvalidRequest
> {
  constructor(
    debugMessage: string,
    private clientMessage: string,
    cause: Error | null = null
  ) {
    super(
      ErrorCode.InvalidRequest,
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

  clone(debugMessage: string): VErrorCode<ErrorCode.InvalidRequest> {
    return new InvalidRequestException(debugMessage, this.clientMessage, this)
  }
}
