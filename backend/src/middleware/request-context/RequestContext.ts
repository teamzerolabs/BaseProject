import { uuidv4 } from '../../util'

export default class RequestContext {
  public readonly id: string

  public identityId: string | null

  constructor() {
    this.id = uuidv4()
  }
}

declare global {
  namespace Express {
    export interface Request {
      context: RequestContext
      auth: any
    }
  }
}
