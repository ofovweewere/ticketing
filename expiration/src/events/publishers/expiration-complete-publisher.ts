import {
  Publisher,
  Subjects,
  type ExpirationCompleteEvent,
} from '@oftickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
