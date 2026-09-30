import { Listener, type OrderCreatedEvent, Subjects } from '@oftickets/common'
import { type Message } from 'node-nats-streaming'

import { queueGroupName } from './queue-group-name.js'
import { Ticket } from '../../models/tickets.js'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher.js'
import { TicketCreatedPublisher } from '../publishers/ticket-created-publisher.js'
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)
    // If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id })
    // Save ticket
    await ticket.save()

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      ...(ticket.orderId !== undefined && {
        orderId: ticket.orderId,
      }),
    })
    // ack the message
    msg.ack()
  }
}
