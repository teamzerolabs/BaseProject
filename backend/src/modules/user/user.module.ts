import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepo } from './repo/user.repo'
import { UserService } from './services/user.service'
import { User } from './entities/User'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserRepo],
  exports: [UserService, UserRepo],
})
export class UserModule {}

export { UserRepo, UserService }
