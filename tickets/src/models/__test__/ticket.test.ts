import { Ticket } from '../tickets.js'
it('implements optimistic concurrency control', async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  })
  // Save the ticket to the database
  await ticket.save()

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  // make two separate changes to the ticket we fetch
  firstInstance!.set({ price: 10 })
  secondInstance!.set({ price: 15 })

  // save the first fetched ticket
  await firstInstance!.save()

  // save the second fetched ticket and expect an error
  try {
    await secondInstance!.save()
  } catch (err) {
    return
  }
  throw new Error('Should not reach this point')
})

it('increments the version on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)

  ticket.price = 10
  await ticket.save()
  expect(ticket.version).toEqual(1)

  let firstInstance = await Ticket.findById(ticket.id)
  firstInstance!.set({ price: 100 })
  await firstInstance!.save()
  expect(firstInstance!.version).toEqual(2)
})
