import { Listener, type OrderCancelledEvent, Subjects } from '@oftickets/common'
import { type Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name.js'
import { Ticket } from '../../models/tickets.js'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher.js'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ orderId: undefined })

    await ticket.save()

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
      ...(ticket.orderId !== undefined && {
        orderId: ticket.orderId,
      }),
    })

    msg.ack()
  }
}
