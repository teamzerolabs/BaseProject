import { Injectable, NestMiddleware } from '@nestjs/common'
import * as bodyParser from 'body-parser'
import { Request, Response } from 'express'
import { InvalidRequestException } from '../../errors/error-types'

/**
 * We use a custom middleware to do body parsing so we can intercept errors and
 * add an error code.
 */
@Injectable()
export class BodyParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    bodyParser.json()(req, res, (err?) => {
      if (err) {
        next(
          new InvalidRequestException(
            'Invalid request body',
            'Invalid request body',
            err
          )
        )
      } else {
        next()
      }
    })
  }
}
