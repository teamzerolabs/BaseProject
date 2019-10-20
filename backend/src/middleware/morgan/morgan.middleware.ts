import { Injectable, NestMiddleware } from '@nestjs/common'
import * as morgan from 'morgan'
import { Request, Response } from 'express'

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  constructor() {
    morgan.token('id', (request: Request) => request.context.id)
  }

  use(req: Request, res: Response, next: Function) {
    morgan(
      ':date[iso] [:id] :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"\n'
    )(req, res, next)
  }
}
