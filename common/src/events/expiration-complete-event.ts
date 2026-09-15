import { Subjects } from './subjects.js'

//Expiration
export interface ExpirationCompleteEvent {
  subject: Subjects.ExpirationComplete
  data: {
    orderId: string
  }
}
