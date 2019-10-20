import { EntityRepository, Repository } from 'typeorm'
import { User } from '../entities/User'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * Gets a user by id
   *
   * @param id
   */
  async findUserById(id: number): Promise<User | undefined> {
    return this.createQueryBuilder('user')
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
    return this.createQueryBuilder('user')
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
    return this.createQueryBuilder('user')
      .select()
      .addSelect('user.password')
      .where(`user.emailAddress = :emailAddress`, { emailAddress })
      .getOne()
  }
}
