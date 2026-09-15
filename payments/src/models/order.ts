import { OrderStatus } from '@oftickets/common'
import mongoose from 'mongoose'

interface OrderAttrs {
  id: string
  version: number
  userId: string
  price: number
  status: OrderStatus
}

interface OrderDoc extends mongoose.Document {
  id: string
  version: number
  userId: string
  price: number
  status: OrderStatus
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
  },
  {
    versionKey: 'version',
    optimisticConcurrency: true,
    toJSON: {
      transform(doc, ret) {
        const { _id, ...rest } = ret

        return {
          id: _id,
          ...rest,
        }
      },
    },
  },
)

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  })
}

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)
