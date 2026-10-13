import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { pushOrderToShiprocket } from '@/lib/shiprocket'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderNumber, orderId } = body

    if (!orderNumber && !orderId) {
      return NextResponse.json(
        { error: 'Please provide orderNumber or orderId' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    let order: any = null
    if (orderId) {
      order = await payload.findByID({ collection: 'orders', id: orderId })
    } else if (orderNumber) {
      const res = await payload.find({
        collection: 'orders',
        where: { orderNumber: { equals: orderNumber } },
        limit: 1,
      })
      order = res.docs?.[0] || null
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const srResult = await pushOrderToShiprocket(order)

    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        shiprocketOrderId: srResult.shiprocketOrderId || order.shiprocketOrderId,
        shiprocketShipmentId: srResult.shiprocketShipmentId || order.shiprocketShipmentId,
        awbCode: srResult.awbCode || order.awbCode,
        courierName: srResult.courierName || order.courierName,
        trackingUrl: srResult.trackingUrl || order.trackingUrl,
        shiprocketStatus: srResult.status,
      },
    })

    return NextResponse.json({
      success: srResult.pushed,
      result: srResult,
    })
  } catch (err: any) {
    console.error('Error in /api/shiprocket/push-order:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to push order to Shiprocket' },
      { status: 500 }
    )
  }
}
