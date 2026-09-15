import { type Message } from 'node-nats-streaming'
import { Listener } from './base-listener.js'
import { type TicketCreatedEvent } from './ticket-created-event.js'
import { Subjects } from './subjects.js'
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName = 'payments-service'

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data)
    console.log(data.id)
    console.log(data.title)
    console.log(data.price)
    msg.ack()
  }
}
