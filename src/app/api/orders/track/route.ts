import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')?.trim()

    if (!query) {
      return NextResponse.json({ error: 'Please enter an Order ID or Phone number' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const isOrderNumber = query.toUpperCase().startsWith('FLV')

    let whereClause: any = {}
    if (isOrderNumber) {
      whereClause = {
        orderNumber: {
          equals: query.toUpperCase(),
        },
      }
    } else {
      // Clean phone number
      const phoneDigits = query.replace(/\D/g, '').slice(-10)
      whereClause = {
        customerPhone: {
          contains: phoneDigits,
        },
      }
    }

    const result = await payload.find({
      collection: 'orders',
      where: whereClause,
      limit: 1,
      sort: '-createdAt',
    })

    if (!result.docs || result.docs.length === 0) {
      return NextResponse.json({ error: 'No order found matching your search. Please check the Order ID or phone number.' }, { status: 404 })
    }

    const order: any = result.docs[0]

    let awbCode = order.awbCode || null
    let courierName = order.courierName || null
    let trackingUrl = order.trackingUrl || (awbCode ? `https://shiprocket.co/tracking/${awbCode}` : null)
    let shiprocketStatus = order.shiprocketStatus || null

    // Sanitize order details for public tracking
    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus || 'new',
        paymentStatus: order.paymentStatus || 'pending',
        customerName: order.customerName,
        createdAt: order.createdAt,
        deliveryDate: order.deliveryDate,
        deliverySlot: order.deliverySlot,
        shiprocketOrderId: order.shiprocketOrderId || null,
        awbCode,
        courierName,
        trackingUrl,
        shiprocketStatus,
        items: order.items?.map((item: any) => ({
          name: item.name,
          variantName: item.variantName,
          quantity: item.quantity,
          price: item.price,
        })),
        total: order.total,
      },
    })
  } catch (error: any) {
    console.error('Error tracking order:', error)
    return NextResponse.json({ error: 'Failed to look up order' }, { status: 500 })
  }
}
