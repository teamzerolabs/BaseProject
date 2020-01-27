import { ErrorCode, VErrorCode } from './error-types'

export class DatabaseErrorException extends VErrorCode<
  ErrorCode.DatabaseError
> {
  constructor(debugMessage: string, cause: Error | null = null) {
    super(
      ErrorCode.DatabaseError,
      {
        cause,
        info: {
          client: {
            message: 'Database error',
          },
        },
      },
      debugMessage
    )
  }

  clone(debugMessage: string): VErrorCode<ErrorCode.DatabaseError> {
    return new DatabaseErrorException(debugMessage, this)
  }
}
