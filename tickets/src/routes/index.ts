import express, { type Request, type Response } from 'express'

import { Ticket } from '../models/tickets.js'

const router = express.Router()

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    $or: [{ orderId: { $exists: false } }, { orderId: null }],
  })

  res.send(tickets)
})

export { router as indexTicketRouter }
