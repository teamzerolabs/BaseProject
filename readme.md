- Make base typescript project from the harmonize monorepo
    - Include documentation
    - No swagger
    - modules: Put each independent units into separate modules
        - controller, routing
            - decorator and class based validation
        - flows
            - Handle higher level business logic and user stories
        - services
            - Reference repositories, perform business task
            - May not depend on business, but work with other apis
        - repositories
            - Handle db connection/complex queries
    - middleware: handle side effects before and after a controller action has ran
    - guards: prevent controller action from running in some cases (unauthenticated)
    - access control via CASL
        - Make an ability object on every request and validate base on context

- 1 module, 1 controller, 1 service
- Demonstrate storing users in db, and retrieving the list of ids for logged in user.


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

