import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { LoggerService } from './services/logger.service'
import { PrometheusService } from './services/prometheus.service'

@Global()
@Module({
  imports: [],
  // providers: [LoggerService, PrometheusService],
  providers: [PrometheusService],
  // exports: [LoggerService, PrometheusService]
  exports: [PrometheusService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {}
}
