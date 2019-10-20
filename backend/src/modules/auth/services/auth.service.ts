import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { addContext, UnauthorizedException } from '../../../errors/error-types'
import { UserService } from '../../user/user.module'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  decode(token: string, opts?: any) {
    return this.jwtService.decode(token, opts)
  }

  async login(usernameOrEmail: string, password: string): Promise<string> {
    const usernameUser = await this.userService
      .findUserByUsername(usernameOrEmail)
      .catch(
        addContext(
          `error fetching user with username=${usernameOrEmail} while logging in`
        )
      )
    const emailUser = await this.userService
      .findUserByEmail(usernameOrEmail)
      .catch(
        addContext(
          `error fetching user with email=${usernameOrEmail} while logging in`
        )
      )

    if (!emailUser && !usernameUser) {
      throw new UnauthorizedException(
        `no user with username/email=${usernameOrEmail} exists`,
        `Invalid username/password`
      )
    }

    const user = usernameUser || emailUser!
    const userRole = user.role

    const isMatch: boolean = await compare(password, user.password!).catch(
      addContext(`error matching bcrypt`)
    )

    // TODO: Migrate to BCrypt after code is running well with existing db.
    // const isMatch: boolean = password === user.password!

    if (!isMatch) {
      throw new UnauthorizedException(
        `password incorrect for username/email=${usernameOrEmail}`,
        `Invalid username/password`
      )
    }

    // TODO: Add appropriate role down the line
    const jwtToken = await this.jwtService
      .signAsync({
        sub: () => user.id.toString(),
        role: userRole,
        name: user.fullName,
      })
      .catch(addContext(`error signing jwt while logging in`))

    return jwtToken
  }
}
