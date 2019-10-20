import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import { logger } from '../../util/logger'
import RequestContext from './RequestContext'

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next) {
    const context = new RequestContext()
    logger.verbose(`Creating request context [${context.id}]`)

    req.context = context

    next!()
  }
}
