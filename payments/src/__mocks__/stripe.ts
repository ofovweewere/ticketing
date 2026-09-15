import { jest } from '@jest/globals'

export const resolvedStripeId = 'ewfdewfew'
export const stripe = {
  charges: {
    // @ts-ignore
    create: jest.fn().mockResolvedValue({ id: resolvedStripeId }),
  },
}
