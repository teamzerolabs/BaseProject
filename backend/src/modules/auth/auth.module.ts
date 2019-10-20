import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import config from '../../config'
import { UserModule } from '../user/user.module'
import { AuthGuard } from './guards/auth.guard'
import { AbilityService } from './services/ability.service'
import { AuthService } from './services/auth.service'

@Module({
  imports: [JwtModule.register({ secret: config.jwt.secret }), UserModule],
  providers: [AuthService, AbilityService, AuthGuard],
  exports: [AuthService, AbilityService, AuthGuard],
})
export class AuthModule {}

export { AuthService, AbilityService, AuthGuard }
