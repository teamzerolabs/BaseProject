import { INestApplication } from '@nestjs/common'
import { UserRoleEnum } from '../../src/modules/auth/types/user-role.enum'
import { User } from '../../src/modules/user/entities/User'
import { UserService } from '../../src/modules/user/services/user.service'
import { logger } from '../../src/util/logger'

async function createUser(
  userService: UserService,
  data: {
    emailAddress: string
    username: string
    password: string
    fullName: string
    role: UserRoleEnum
  }
): Promise<User> {
  const user = await userService.createUser(data)
  return user
}

export async function seedDummyAdminUser(app: INestApplication) {
  const userService = app.get(UserService)

  await createUser(userService, {
    emailAddress: 'admin@base.com',
    username: 'admin',
    password: 'base2019',
    fullName: 'Admin Admin',
    role: UserRoleEnum.Admin,
  })
  logger.info('Admin user inserted!')
}

export async function seedOtherDummyUsers(
  app: INestApplication
): Promise<User[]> {
  const userService = app.get(UserService)
  const users: User[] = []
  users.push(
    await createUser(userService, {
      emailAddress: 'viewer@base.com',
      username: 'viewer',
      password: 'base2019',
      fullName: 'Viewer Viewer',
      role: UserRoleEnum.Viewer,
    })
  )
  logger.info('1 user inserted!')
  return users
}
