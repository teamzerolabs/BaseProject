import 'reflect-metadata'
import { Connection, createConnection } from 'typeorm'
import config from '../config'
import * as ormConfig from '../config/ormconfig'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'

export async function synchronize(dbName: string) {
  const connection = await createConnection({
    name: 'sync',
    type: 'mysql',
    ...config.mysql,
    ...ormConfig,
    database: dbName,
  } as MysqlConnectionOptions)

  await connection.synchronize(false)
  await connection.close()
}

/**
 * Creates a database with specified name based on ormConfig.json
 *
 * @param dbName name of database to create
 * @param drop true if the database should be dropped first (hard reset)
 */
export async function createDatabaseIfNotExists(
  dbName: string,
  drop: boolean
): Promise<any> {
  try {
    const connection = await createConnection({
      type: 'mysql',
      ...config.mysql,
      database: 'mysql',
    } as MysqlConnectionOptions)

    const queryRunner = connection.createQueryRunner()

    if (drop) {
      await queryRunner.dropDatabase(dbName, true)
      console.log(`Dropped database ${dbName}`)
    }

    await queryRunner.createDatabase(dbName, true)
    await synchronize(dbName)
    console.log(`Database ${dbName} successfully created/synchronized!`)

    return connection.close()
  } catch (e) {
    console.error(e)
    throw new Error('Failed to create database')
  }
}
