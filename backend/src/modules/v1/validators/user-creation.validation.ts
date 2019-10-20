import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import {
  addContext,
  InvalidRequestException,
} from '../../../errors/error-types'
import { UserService } from '../../user/user.module'
import { UserCreationRequest } from '../types/user.types'

/**
 * Makes the following validation checks
 *
 * - If user with given EmailAddress exists
 * - If user with given Username exists
 */
@Injectable()
export class UserCreationValidationPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(
    value: UserCreationRequest,
    metadata: ArgumentMetadata
  ): Promise<UserCreationRequest> {
    const { emailAddress, username } = value

    const existingEmail = await this.userService
      .findUserByEmail(emailAddress)
      .catch(addContext(`error getting user with emailAddress=${emailAddress}`))

    if (existingEmail) {
      throw new InvalidRequestException(
        `user with emailAddress=${emailAddress} already exists`,
        `A user with that email address already exists`
      )
    }

    const existingUsername = await this.userService
      .findUserByUsername(username)
      .catch(addContext(`error getting user with username=${username}`))

    if (existingUsername) {
      throw new InvalidRequestException(
        `user with username=${username} already exists`,
        `A user with that username already exists`
      )
    }

    return value
  }
}
