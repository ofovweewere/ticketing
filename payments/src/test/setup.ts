import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
  var signin: (id?: string) => string[]
}

import { jest } from '@jest/globals'

import { natsWrapper } from '../__mocks__/nats-wrapper.js'
import { stripe } from '../__mocks__/stripe.js'

jest.unstable_mockModule('../stripe.js', () => {
  return {
    __esModule: true,
    stripe,
  }
})

jest.unstable_mockModule('../nats-wrapper.ts', () => {
  return {
    __esModule: true,
    natsWrapper,
  }
})

let mongo: any
jest.setTimeout(300000)

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf'
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
  jest.clearAllMocks()
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
      await collection.deleteMany({})
    }
  }
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop()
  }
  await mongoose.connection.close()
})

global.signin = (id?: string) => {
  //Build a JWT payload. {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  }

  //Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  //Build session Object. {jwt: MY_JWT}
  const session = { jwt: token }
  //Turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  //return a string thats the cookie with the encoded data
  return [`session=${base64}`]
}
