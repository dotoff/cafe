import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getSessionCustomer } from '@/lib/customerAuth'

export async function GET() {
  try {
    const session = await getSessionCustomer()

    if (!session) {
      return NextResponse.json({ authenticated: false, customer: null, orders: [] })
    }

    const payload = await getPayload({ config: configPromise })

    const customerResult = await payload.find({
      collection: 'customers',
      where: {
        phone: {
          equals: session.phone,
        },
      },
      limit: 1,
    })

    if (customerResult.docs.length === 0) {
      return NextResponse.json({ authenticated: false, customer: null, orders: [] })
    }

    const customer = customerResult.docs[0] as any

    // Query past orders by customer phone number
    const ordersResult = await payload.find({
      collection: 'orders',
      where: {
        customerPhone: {
          equals: session.phone,
        },
      },
      sort: '-createdAt',
      limit: 20,
    })

    return NextResponse.json({
      authenticated: true,
      customer: {
        id: customer.id,
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
        addresses: customer.addresses || [],
      },
      orders: ordersResult.docs.map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        paymentStatus: o.paymentStatus,
        total: o.total,
        itemCount: o.items?.length || 0,
        createdAt: o.createdAt,
        items: o.items || [],
        courierTrackingUrl: o.courierTrackingUrl,
      })),
    })
  } catch (err: any) {
    console.error('Error fetching customer session:', err)
    return NextResponse.json({ authenticated: false, customer: null, orders: [] })
  }
}
