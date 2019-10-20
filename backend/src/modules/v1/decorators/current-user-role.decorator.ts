import { createParamDecorator } from '@nestjs/common'

export const CurrentUserRole = createParamDecorator((data, req) => {
  return req.auth.role
})
