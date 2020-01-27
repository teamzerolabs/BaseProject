import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as express from 'express'
import { Response } from 'express'
import { AppModule } from './app.module'
import config from './config'
import { InternalException } from './errors/error-types'
import { PrometheusService } from './modules/common/services/prometheus.service'
import { logger } from './util/logger'

export async function createApp() {
  const app = await NestFactory.create(AppModule)

  // Send 204 for requests to /
  app.getHttpAdapter().get('/', (_, res: Response) => {
    res.sendStatus(204)
  })

  app.enableCors()

  // Set up validation
  app.useGlobalPipes(new ValidationPipe())

  return app
}

// We store app outside of bootstrap function to be able to close the Nest application
// on unexpected errors
let app: INestApplication

async function bootstrap() {
  app = await createApp()

  const prometheusService = app.get<PrometheusService>(PrometheusService)
  if (!prometheusService) {
    throw new InternalException(
      `Prometheus service could not retrieved from app`,
      null
    )
  }

  process.on('unhandledRejection', (err) => {
    prometheusService.unhandledRejectionLogged()
  })

  await app.listen(config.app.port, () =>
    logger.info(`${config.app.name} listening on port ${config.app.port}`)
  )

  const metricServer: express.Application = express()
  metricServer.get('/metrics', (req, res) =>
    res.send(prometheusService.getMetrics())
  )

  await metricServer.listen(config.prometheus.port, () =>
    logger.info(
      `🚨 Prometheus listening on port ${config.prometheus.port} /metrics`
    )
  )
}

bootstrap().catch(async (err) => {
  logger.error(`Failed to start server`)
  logger.error(err)

  if (app) {
    await app.close()
  }

  process.exit(1)
})
