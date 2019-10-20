import { MorganMiddleware } from './morgan.middleware'

describe('MorganMiddleware', () => {
  it('should be defined', () => {
    expect(new MorganMiddleware()).toBeTruthy()
  })
})
