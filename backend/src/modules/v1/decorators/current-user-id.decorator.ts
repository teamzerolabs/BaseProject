import { createParamDecorator } from '@nestjs/common'

export const CurrentUserId = createParamDecorator((data, req): number => {
  return parseInt(req.auth.sub)
})
