import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app.js'
import { Order, OrderStatus } from '../../models/order.js'
import { Ticket } from '../../models/ticket.js'
import { natsWrapper } from '../../nats-wrapper.js'

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404)
})

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })

  await ticket.save()
  const order = Order.build({
    ticket,
    userId: 'vferverrv',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })
  await order.save()
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('returns a ticket', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)
})

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

// it('emits an order created event', async () => {
//   const ticket = Ticket.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     title: 'concert',
//     price: 20,
//   })

//   await ticket.save()

//   request(app)
//     .post('/api/orders')
//     .set('Cookie', global.signin())
//     .send({ ticketId: ticket.id })
//     .expect(201)

//   await request(app)
//     .post('/api/orders')
//     .set('Cookie', global.signin())
//     .send({ ticketId: ticket.id })
//     .expect(201)

//   expect(natsWrapper.client.publish).toHaveBeenCalled()
// })

it.todo('the above commented out test should fail')
