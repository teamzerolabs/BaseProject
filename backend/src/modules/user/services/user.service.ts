import { Injectable } from '@nestjs/common'
import { hash } from 'bcrypt'
import { Transactional } from 'typeorm-transactional-cls-hooked'
import { addContext } from '../../../errors/error-types'
import { NotFoundException } from '../../../errors/NotFoundException'
import { UserRoleEnum } from '../../auth/types/user-role.enum'
import { User } from '../entities/User'
import { UserRepo } from '../repo/user.repo'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepo) {}

  /**
   * Gets a user by id
   *
   * @param id
   */
  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findUserById(id)
    if (!user) {
      throw new NotFoundException(
        `User not found with userId=${id}`,
        `User not found with userId=${id}`
      )
    }
    return user
  }

  /**
   * Find users by their username
   *
   * @param username
   */
  findUserByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findUserByUsername(username)
  }

  /**
   * Find users by their email
   *
   * @param emailAddress
   */
  findUserByEmail(emailAddress: string): Promise<User | undefined> {
    return this.userRepository.findUserByEmail(emailAddress)
  }

  /**
   * Create user, hash password with bcrypt
   *
   * @param data
   */
  @Transactional()
  async createUser(data: {
    emailAddress: string
    username: string
    password: string
    fullName: string
    role: UserRoleEnum
  }): Promise<User> {
    const { emailAddress, username, password, fullName, role } = data

    const hashedPassword = await hash(password, 10).catch(
      addContext(`error hashing password`)
    )

    return this.userRepository
      .createUser({
        username,
        emailAddress,
        hashedPassword,
        fullName,
        role,
      })
      .catch(addContext(`error saving new user entity`))
  }
}
