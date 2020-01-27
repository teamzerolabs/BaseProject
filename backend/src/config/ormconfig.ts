import config from './index'

const rootPath = process.env.NODE_ENV === 'production' ? '/app' : './src'

const options = {
  type: 'mysql',
  synchronize: false,
  logging: true,
  logger: 'file',
  entities: [
    `${rootPath}/modules/**/entities/*{.ts,.js}`,
    `${rootPath}/modules/**/views/*{.ts,.js}`,
  ],
  migrations: [`${rootPath}/migrations/*{.ts,.js}`],
  cli: {
    migrationsDir: 'src/migrations',
  },
  // extra: {
  //   max: 32,
  // },
  options: {
    encrypt: true,
  },
  ...config.mysql,
}

export = options
