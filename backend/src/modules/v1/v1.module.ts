import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { BodyParserMiddleware } from '../../middleware/body-parser/body-parser.middleware'
import { HelmetMiddleware } from '../../middleware/helmet/helmet.middleware'
import { MorganMiddleware } from '../../middleware/morgan/morgan.middleware'
import { RequestContextMiddleware } from '../../middleware/request-context/request-context.middleware'
import { AuthModule } from '../auth/auth.module'
import { UserModule } from '../user/user.module'
import { AuthController } from './controllers/auth/auth.controller'
import { UserController } from './controllers/user/user.controller'

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AuthController, UserController],
  providers: [],
})
export class V1Module implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(
        HelmetMiddleware,
        RequestContextMiddleware,
        MorganMiddleware,
        BodyParserMiddleware
      )
      .forRoutes({ path: '/api/v1', method: RequestMethod.ALL })
  }
}
