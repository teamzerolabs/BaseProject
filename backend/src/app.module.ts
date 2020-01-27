import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RouterModule } from 'nest-router'
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked'

import * as ormConfig from './config/ormconfig'
import { GeneralExceptionFilter } from './errors/exception.filter'
import { CommonModule } from './modules/common/common.module'
import { V1Module } from './modules/v1/v1.module'
import { routes } from './routes'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'

initializeTransactionalContext() // Initialize cls-hooked
patchTypeORMRepositoryWithBaseRepository() // patch Repository with BaseRepository.

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    CommonModule,
    V1Module,
    TypeOrmModule.forRoot({
      type: 'mysql',
      name: 'default',
      ...ormConfig,
    } as MysqlConnectionOptions),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GeneralExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
