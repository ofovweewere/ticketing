import {
  Publisher,
  Subjects,
  type OrderCancelledEvent,
} from '@oftickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
