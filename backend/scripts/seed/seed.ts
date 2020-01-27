import { NestFactory } from '@nestjs/core'
import * as VError from 'verror'
import { AppModule } from '../../src/app.module'
import { logger } from '../../src/util/logger'
import { seedDummyAdminUser, seedOtherDummyUsers } from './seed-user'
import { INestApplication } from '@nestjs/common'

async function seedDummyData(app: INestApplication) {
  await seedDummyAdminUser(app)
  await seedOtherDummyUsers(app)
}

async function seed() {
  const app = await NestFactory.create(AppModule)
  await app.init()

  try {
    //
    // // These can be removed later, label dummy table datas as such
    await seedDummyData(app)
  } catch (e) {
    throw e
  } finally {
    await app.close()
  }
}

seed()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    logger.error(VError.fullStack(err))
  })
