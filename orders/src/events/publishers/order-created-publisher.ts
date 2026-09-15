import { Publisher, Subjects, type OrderCreatedEvent } from '@oftickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
