import { Repository } from 'typeorm'
import { User } from '../entities/User'
import { Injectable } from '@nestjs/common'
import { Transactional } from 'typeorm-transactional-cls-hooked'
import { UserRoleEnum } from '../../auth/types/user-role.enum'
import { addContext } from '../../../errors/error-types'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UserRepo {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>
  ) {}

  /**
   * Gets a user by id
   *
   * @param id
   */
  async findUserById(id: number): Promise<User | undefined> {
    return this.repo
      .createQueryBuilder('user')
      .select()
      .where(`user.id = :id`, { id })
      .getOne()
  }

  /**
   * Find users by their username
   *
   * @param username
   */
  async findUserByUsername(username: string): Promise<User | undefined> {
    return this.repo
      .createQueryBuilder('user')
      .select()
      .addSelect('user.password')
      .where(`user.username = :username`, { username })
      .getOne()
  }

  /**
   * Find users by their email
   *
   * @param emailAddress
   */
  async findUserByEmail(emailAddress: string): Promise<User | undefined> {
    return this.repo
      .createQueryBuilder('user')
      .select()
      .addSelect('user.password')
      .where(`user.emailAddress = :emailAddress`, { emailAddress })
      .getOne()
  }

  @Transactional()
  async updateUserRole(data: {
    id: number
    roleName: UserRoleEnum
  }): Promise<User | undefined> {
    const { id, roleName } = data
    await this.repo.update(id, { role: roleName })

    return this.findUserById(id)
  }

  @Transactional()
  async createUser(data: {
    emailAddress: string
    username: string
    hashedPassword: string
    fullName: string
    role: UserRoleEnum
  }): Promise<User> {
    const { emailAddress, username, hashedPassword, fullName, role } = data

    return this.repo
      .save({
        username,
        emailAddress,
        password: hashedPassword,
        fullName,
        role,
      })
      .catch(addContext(`error saving new user entity`))
  }
}
