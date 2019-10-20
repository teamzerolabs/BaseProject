import {
  ErrorCode,
  InvalidRequestException,
  VErrorCode,
  VErrorCodeOptions,
} from './error-types'

export class ValidationFailedException extends VErrorCode<
  ErrorCode.InvalidRequest
> {
  constructor(
    debugMessage: string,
    private clientMessage: string,
    private failureReason: any,
    cause: Error | null = null
  ) {
    super(
      ErrorCode.InvalidRequest,
      {
        cause,
        info: {
          client: {
            message: clientMessage,
            failureReason,
          },
        },
      } as VErrorCodeOptions,
      debugMessage
    )
  }

  clone(debugMessage: string): VErrorCode<ErrorCode.InvalidRequest> {
    return new InvalidRequestException(debugMessage, this.clientMessage, this)
  }
}
