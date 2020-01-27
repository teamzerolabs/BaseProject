import config from '../src/config'
import { createDatabaseIfNotExists } from '../src/util/db-setup'
import { logger } from '../src/util/logger'

const dropDb = process.env.RESET_DB === 'true'
createDatabaseIfNotExists(config.mysql.database, dropDb).catch((err) => {
  logger.error(err)
  process.exit(1)
})
