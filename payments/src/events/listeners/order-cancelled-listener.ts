import {
  type OrderCancelledEvent,
  Subjects,
  Listener,
  OrderStatus,
} from '@oftickets/common'
import type { Message } from 'node-nats-streaming'

import { queueGroupName } from './queue-group-name.js'
import { Order } from '../../models/order.js'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    })

    if (!order) {
      throw new Error('Order not found')
    }

    order.set({ status: OrderStatus.Cancelled })
    await order.save()

    msg.ack()
  }
}
