import express, { type Request, type Response } from 'express'
import { NotFoundError } from '@oftickets/common'

import { Ticket } from '../models/tickets.js'
const router = express.Router()

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    throw new NotFoundError()
  }

  res.send(ticket)
})

export { router as showTicketRouter }
