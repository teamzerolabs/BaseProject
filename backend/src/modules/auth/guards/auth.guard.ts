import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { UnauthorizedException } from '../../../errors/UnauthorizedException'
import { logger } from '../../../util/logger'
import { AuthService } from '../services/auth.service'
import VError = require('verror')

/**
 * SENSITIVE CODE, do not make changes without consulting code owners
 *
 * Do not simplify equality statements, strong type checking doesn't hurt. The
 * reasoning is to avoid any ambiguity to avoid bugs from future code changes.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  static getAccessToken(req: Request): string | undefined {
    const match =
      req.header('Authorization') &&
      req.header('Authorization')!.match(/^Bearer\s+(\S+)/)

    return (
      (match && match[1]) ||
      (req.cookies && req.cookies.access_token) ||
      (req.signedCookies && req.signedCookies.access_token)
    )
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const accessToken = AuthGuard.getAccessToken(request)
    if (accessToken) {
      try {
        await this.authService.verify(accessToken)

        const decoded = this.authService.decode(accessToken, { json: true })
        if (decoded) {
          request.auth = decoded
        }
        return true
      } catch (e) {
        logger.error(
          `error decoding authorization token ${VError.fullStack(e)}`
        )
      }
    }

    throw new UnauthorizedException(
      'AuthGuard user has no authentication',
      'Not authenticated'
    )
  }
}
