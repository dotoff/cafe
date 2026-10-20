import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  try {
    const { orderId, newStatus } = await req.json()

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: 'Missing orderId or newStatus' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const updated = await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        orderStatus: newStatus,
      },
    })

    return NextResponse.json({ success: true, order: updated })
  } catch (error: any) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ error: error?.message || 'Failed to update order' }, { status: 500 })
  }
}
