import mongoose from 'mongoose'
import { type OrderCancelledEvent } from '@oftickets/common'
import { type Message } from 'node-nats-streaming'
import { jest } from '@jest/globals'

import { natsWrapper } from '../../../nats-wrapper.js'
import { OrderCancelledListener } from '../order-cancelled-listener.js'
import { Ticket } from '../../../models/tickets.js'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const orderId = new mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'dcfsd',
  })
  ticket.set({ orderId })
  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { msg, data, ticket, orderId, listener }
}

it('updates the ticket, publishes an event, and acks the message', async () => {
  const { msg, data, ticket, orderId, listener } = await setup()

  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
