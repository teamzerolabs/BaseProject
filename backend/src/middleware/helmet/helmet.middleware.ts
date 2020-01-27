import { Injectable, NestMiddleware } from '@nestjs/common'
import * as helmet from 'helmet'

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    return helmet()(req, res, next)
  }
}
