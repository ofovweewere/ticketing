import { OrderStatus, type OrderCancelledEvent } from '@oftickets/common'
import mongoose from 'mongoose'
import type { Message } from 'node-nats-streaming'
import { jest } from '@jest/globals'

import { Order } from '../../../models/order.js'
import { natsWrapper } from '../../../nats-wrapper.js'
import { OrderCancelledListener } from '../order-cancelled-listener.js'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    userId: 'dsvfds',
    version: 0,
    status: OrderStatus.Created,
  })
  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'dscfds',
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, order }
}

it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
  const { listener, data, msg, order } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
