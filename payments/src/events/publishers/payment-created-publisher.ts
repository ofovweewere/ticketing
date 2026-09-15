import {
  Subjects,
  Publisher,
  type PaymentCreatedEvent,
} from '@oftickets/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
