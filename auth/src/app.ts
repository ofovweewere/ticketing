import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@oftickets/common'

import { currentUserRouter } from './routes/current-user.js'
import { signinRouter } from './routes/signin.js'
import { signoutRouter } from './routes/signout.js'
import { signupRouter } from './routes/signup.js'

const app = express()
app.set('trust proxy', true)
app.use(bodyParser.json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
)
app.use(morgan('dev'))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
