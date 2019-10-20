
- Tools used: Typescript/NestJS/Typeorm/Mysql/Prometheus
- No swagger
- modules: Put each independent units into separate modules
    - controller, routing
        - decorator and class based validation
    - services
        - Reference repositories, perform business task
        - May not depend on business, but work with other apis
    - flows
        - Handle higher level business logic and user stories
    - repositories
        - Handle db connection/complex queries
- middleware: handle side effects before and after a controller action has ran
- guards: prevent controller action from running in some cases (unauthenticated)
- access control via CASL
    - Make an ability object on every request and validate base on context

- 1 module, 1 controller, 1 service
- Demonstrate storing users in db, and retrieving a single user record.

```
./src/
├── app.module.ts
├── config
│   ├── index.ts
│   ├── ormconfig.ts
│   └── util.ts
├── errors
│   ├── DatabaseErrorException.ts
│   ├── InvalidRequestException.ts
│   ├── NotFoundException.ts
│   ├── PrometheusFailureException.ts
│   ├── TimeoutException.ts
│   ├── UnauthorizedException.ts
│   ├── UnhealthyException.ts
│   ├── ValidationFailedException.ts
│   ├── error-types.ts
│   └── exception.filter.ts
├── interceptors
│   └── request-logging.interceptor.ts
├── main.ts
├── middleware
│   ├── body-parser
│   │   └── body-parser.middleware.ts
│   ├── helmet
│   │   └── helmet.middleware.ts
│   ├── morgan
│   │   ├── morgan.middleware.spec.ts
│   │   └── morgan.middleware.ts
│   └── request-context
│       ├── RequestContext.ts
│       └── request-context.middleware.ts
├── modules
│   ├── auth
│   │   ├── auth.module.ts
│   │   ├── guards
│   │   │   └── auth.guard.ts
│   │   ├── services
│   │   │   ├── ability.service.ts
│   │   │   └── auth.service.ts
│   │   └── types
│   │       ├── user-action.enum.ts
│   │       └── user-role.enum.ts
│   ├── common
│   │   ├── common.module.ts
│   │   └── services
│   │       ├── logger.service.ts
│   │       └── prometheus.service.ts
│   ├── user
│   │   ├── entities
│   │   │   └── User.ts
│   │   ├── repo
│   │   │   └── user.repo.ts
│   │   ├── services
│   │   │   └── user.service.ts
│   │   ├── types
│   │   └── user.module.ts
│   └── v1
│       ├── controllers
│       │   ├── auth
│       │   │   └── auth.controller.ts
│       │   └── user
│       │       └── user.controller.ts
│       ├── types
│       │   ├── auth.types.ts
│       │   └── user.types.ts
│       ├── v1.module.ts
│       └── validators
│           └── user-creation.validation.ts
├── routes.ts
└── util
    ├── db-setup.ts
    ├── index.ts
    └── logger.ts

27 directories, 45 files
```

```
jacks-mbp:backend jack$ yarn start
yarn run v1.17.3
$ ts-node -r tsconfig-paths/register --files src/main.ts
2019-10-20T00:37:43.481Z [no context] info: Loading config from environment file src/config/.env 
[Nest] 29805   - 2019-10-19 17:37:43   [NestFactory] Starting Nest application...
[Nest] 29805   - 2019-10-19 17:37:43   [InstanceLoader] CommonModule dependencies initialized +82ms
[Nest] 29805   - 2019-10-19 17:37:43   [InstanceLoader] TypeOrmModule dependencies initialized +0ms
[Nest] 29805   - 2019-10-19 17:37:43   [InstanceLoader] JwtModule dependencies initialized +1ms
[Nest] 29805   - 2019-10-19 17:37:43   [InstanceLoader] RouterModule dependencies initialized +1ms
[Nest] 29805   - 2019-10-19 17:37:43   [InstanceLoader] AppModule dependencies initialized +1ms
[Nest] 29805   - 2019-10-19 17:37:43   [InstanceLoader] TypeOrmCoreModule dependencies initialized +66ms
[Nest] 29805   - 2019-10-19 17:37:43   [InstanceLoader] TypeOrmModule dependencies initialized +0ms
[Nest] 29805   - 2019-10-19 17:37:43   [InstanceLoader] UserModule dependencies initialized +1ms
[Nest] 29805   - 2019-10-19 17:37:43   [InstanceLoader] AuthModule dependencies initialized +1ms
[Nest] 29805   - 2019-10-19 17:37:43   [InstanceLoader] V1Module dependencies initialized +1ms
[Nest] 29805   - 2019-10-19 17:37:43   [RoutesResolver] AuthController {/api/v1/}: +20ms
[Nest] 29805   - 2019-10-19 17:37:43   [RouterExplorer] Mapped {/login, POST} route +3ms
[Nest] 29805   - 2019-10-19 17:37:43   [RoutesResolver] UserController {/api/v1/users}: +0ms
[Nest] 29805   - 2019-10-19 17:37:43   [RouterExplorer] Mapped {/:userId, GET} route +2ms
[Nest] 29805   - 2019-10-19 17:37:43   [RouterExplorer] Mapped {/, POST} route +1ms
[Nest] 29805   - 2019-10-19 17:37:43   [NestApplication] Nest application successfully started +3ms
2019-10-20T00:37:43.997Z [no context] info: base listening on port 8080 
2019-10-20T00:37:43.997Z [no context] info: Prometheus listening on port 9101 /metrics 
```