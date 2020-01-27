import { Ability, AbilityBuilder } from '@casl/ability'
import { Injectable } from '@nestjs/common'
import { UserActionType } from '../types/user-action.enum'
import { UserRoleEnum } from '../types/user-role.enum'
import { User } from '../../user/entities/User'

@Injectable()
export class AbilityService {
  // All methods declare takes in (UserRole, EntityInstance) and returns
  // an ability

  // @NOTE: The rules below can make use of the alert that's passed in.
  checkUser(
    userRole: UserRoleEnum,
    targetUser?: User,
    currentUser?: User
  ): Ability {
    const action = UserActionType.UserAction
    const { rules, can } = AbilityBuilder.extract()

    // Admins can do anything, in any context
    if (userRole === UserRoleEnum.Admin) {
      can(
        [
          action.ChangeRole,
          action.Create,
          action.Delete,
          action.Read,
          action.Update,
        ],
        User
      )
    }

    // Can act on the target user if currentUser is targetUser
    if (targetUser) {
      if (currentUser && currentUser === targetUser) {
        can([action.Delete, action.Read, action.Update], User)
      }
    }

    return new Ability(rules)
  }
}
