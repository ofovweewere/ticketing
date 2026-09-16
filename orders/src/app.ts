import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@oftickets/common'

import { deleteOrderRouter } from './routes/delete.js'
import { indexOrderRouter } from './routes/index.js'
import { newOrderRouter } from './routes/new.js'
import { showOrderRouter } from './routes/show.js'

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

app.use(deleteOrderRouter)
app.use(indexOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
