import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@oftickets/common'

import { createChargeRouter } from './routes/new.js'

const app = express()
app.set('trust proxy', true)
app.use(bodyParser.json())
// app.use(
//   cookieSession({
//     signed: false,
//     secure: process.env.NODE_ENV !== 'test',
//   }),
// )
cookieSession({
  signed: false,
  secure: false,
})

app.use(currentUser)
app.use(morgan('dev'))

app.use(createChargeRouter)
app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
