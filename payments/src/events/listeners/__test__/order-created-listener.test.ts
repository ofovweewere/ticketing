import { OrderStatus, type OrderCreatedEvent } from '@oftickets/common'
import mongoose from 'mongoose'
import type { Message } from 'node-nats-streaming'
import { jest } from '@jest/globals'

import { natsWrapper } from '../../../nats-wrapper.js'
import { OrderCreatedListener } from '../order-created-listener.js'
import { Order } from '../../../models/order.js'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'sdfsd',
    userId: 'sdfds',
    status: OrderStatus.Created,
    ticket: {
      id: 'ddsvsd',
      price: 10,
    },
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const order = await Order.findById(data.id)
  expect(order!.price).toEqual(data.ticket.price)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
