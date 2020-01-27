import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { RequestLoggingInterceptor } from '../../../../interceptors/request-logging.interceptor'
import { AuthService } from '../../../auth/auth.module'
import { UserLoginRequest, UserLoginResponse } from '../../types/auth.types'

@Controller({ path: '' })
@UseInterceptors(RequestLoggingInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() req: UserLoginRequest): Promise<UserLoginResponse> {
    const jwtToken = await this.authService.login(
      req.emailAddress || req.username,
      req.password
    )

    return {
      jwtToken,
    }
  }
}
