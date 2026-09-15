import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Router from 'next/router'

import useRequest from '../../hooks/use-request'

const StripeCheckout = dynamic(
  () => import('react-stripe-checkout').then((mod) => mod.default),
  { ssr: false },
)

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push('/orders'),
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }
    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [order])

  if (timeLeft < 0) {
    return <div>Order Expired</div>
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51UFL1KJJk9jwDV0oKBiVQKe5fATsJzG5jNdf7zhXQlkFaUbT3ed1RZXIfBw1at4haEwLLknlRvzzXcBRysuPHdt7001UCJXtOs"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}
export default OrderShow
