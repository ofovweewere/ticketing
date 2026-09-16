import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@oftickets/common'

import { createTicketRouter } from './routes/new.js'
import { showTicketRouter } from './routes/show.js'
import { indexTicketRouter } from './routes/index.js'
import { updateTicketRouter } from './routes/update.js'

const app = express()
app.set('trust proxy', true)
app.use(bodyParser.json())
// app.use(
//   cookieSession({
//     signed: false,
//     secure: process.env.NODE_ENV !== 'test',
//   }),
// )
app.use(
  cookieSession({
    signed: false,
    secure: false,
  }),
)

app.use(currentUser)
app.use(morgan('dev'))

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
