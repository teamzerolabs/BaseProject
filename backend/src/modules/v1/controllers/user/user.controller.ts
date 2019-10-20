import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  addContext,
  InternalException,
  NotFoundException,
} from '../../../../errors/error-types'
import { RequestLoggingInterceptor } from '../../../../interceptors/request-logging.interceptor'
import { AbilityService, AuthGuard } from '../../../auth/auth.module'
import { UserCreationValidationPipe } from '../../validators/user-creation.validation'
import { UserService } from '../../../user/user.module'
import { UserCreationRequest, UserResponse } from '../../types/user.types'
import { CurrentUserRole } from '../../decorators/current-user-role.decorator'
import { CurrentUserId } from '../../decorators/current-user-id.decorator'
import { UserRoleEnum } from '../../../auth/types/user-role.enum'
import { UserActionType } from '../../../auth/types/user-action.enum'
import { User } from '../../../user/entities/User'

const Action = UserActionType.UserAction

@Controller({ path: '/users' })
@UseInterceptors(RequestLoggingInterceptor)
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly abilityService: AbilityService
  ) {}

  @Get('/:userId')
  async getUserById(
    @Param('userId', new ParseIntPipe()) userId: number,
    @CurrentUserRole() role: UserRoleEnum,
    @CurrentUserId() currentUserId: number
  ): Promise<UserResponse> {
    const currentUser = await this.userService.getUserById(userId)

    const targetUser = await this.userService
      .getUserById(userId)
      .catch(addContext(`error getting user`))

    if (!targetUser) {
      throw new NotFoundException(
        `user not found`,
        `User with ID=${userId} does not exist`
      )
    }

    const ability = this.abilityService.checkUser(role, targetUser, currentUser)
    ability.throwUnlessCan(Action.Read, User)

    return targetUser
  }

  @Post('/')
  async createUser(
    @Body(UserCreationValidationPipe) req: UserCreationRequest,
    @CurrentUserRole() role: UserRoleEnum,
    @CurrentUserId() userId: number
  ): Promise<UserResponse> {
    try {
      const user = await this.userService.getUserById(userId)
      const ability = this.abilityService.checkUser(role, undefined, user)

      ability.throwUnlessCan(Action.Create, User)

      return await this.userService.createUser(req)
    } catch (e) {
      throw new InternalException('error creating user', e)
    }
  }
}
