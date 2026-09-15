import { type Message } from 'node-nats-streaming'
import { Subjects, Listener, type TicketUpdatedEvent } from '@oftickets/common'
import { Ticket } from '../../models/ticket.js'
import { queueGroupName } from './queue-group-name.js'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
  queueGroupName = queueGroupName

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    const { title, price, version } = data

    ticket.set({ title, price })
    ticket.markModified('version')

    await ticket.save()
    const t = await Ticket.find({})

    msg.ack()
  }
}
