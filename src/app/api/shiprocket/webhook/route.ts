import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Shiprocket sends order_id (our orderNumber), awb, courier_name, current_status, etc.
    const orderNumber = body.order_id || body.channel_order_id
    const srOrderId = body.sr_order_id ? String(body.sr_order_id) : undefined
    const awbCode = body.awb ? String(body.awb) : undefined
    const courierName = body.courier_name ? String(body.courier_name) : undefined
    const currentStatus = String(body.current_status || body.shipment_status || '').toUpperCase()

    if (!orderNumber && !srOrderId) {
      return NextResponse.json({ received: true, message: 'No order identifier in payload' })
    }

    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'orders',
      where: orderNumber
        ? { orderNumber: { equals: String(orderNumber) } }
        : { shiprocketOrderId: { equals: srOrderId } },
      limit: 1,
    })

    const order: any = result.docs?.[0]
    if (!order) {
      return NextResponse.json({ received: true, message: 'Order not found in CMS' })
    }

    // Map Shiprocket status to our internal orderStatus
    let mappedStatus = order.orderStatus
    if (
      currentStatus.includes('DELIVERED') &&
      !currentStatus.includes('UNDELIVERED') &&
      !currentStatus.includes('OUT FOR DELIVERY')
    ) {
      mappedStatus = 'delivered'
    } else if (
      currentStatus.includes('OUT FOR DELIVERY') ||
      currentStatus.includes('IN TRANSIT') ||
      currentStatus.includes('SHIPPED') ||
      currentStatus.includes('PICKED UP')
    ) {
      mappedStatus = 'out_for_delivery'
    } else if (currentStatus.includes('CANCELED') || currentStatus.includes('CANCELLED')) {
      mappedStatus = 'cancelled'
    }

    const trackingUrl = awbCode
      ? `https://shiprocket.co/tracking/${awbCode}`
      : order.trackingUrl

    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        orderStatus: mappedStatus,
        awbCode: awbCode || order.awbCode,
        courierName: courierName || order.courierName,
        trackingUrl,
        shiprocketStatus: currentStatus || order.shiprocketStatus,
      },
    })

    return NextResponse.json({ success: true, orderNumber: order.orderNumber, status: mappedStatus })
  } catch (err: any) {
    console.error('Shiprocket webhook error:', err)
    return NextResponse.json({ error: err?.message || 'Webhook error' }, { status: 500 })
  }
}
