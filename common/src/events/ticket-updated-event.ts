import { Subjects } from './subjects.js'

// For any updated ticket
export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated
  data: {
    id: string
    version: number //version number
    title: string
    price: number
    userId: string
    orderId?: string
  }
}
