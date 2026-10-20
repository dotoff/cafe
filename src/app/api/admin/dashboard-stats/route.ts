import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    // Fetch all orders (up to 500 recent)
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: 500,
      sort: '-createdAt',
    })

    const orders = ordersResult.docs || []

    // Fetch products to check out-of-stock items
    const productsResult = await payload.find({
      collection: 'products',
      limit: 200,
    })

    const products = productsResult.docs || []
    const soldOutProducts = products
      .filter((p: any) => p.inStock === false)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
      }))

    // Date calculations for "Today" (in IST / local time)
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

    let todayRevenue = 0
    let todayOrdersCount = 0
    let totalRevenue = 0
    let bakingCount = 0
    let outForDeliveryCount = 0
    let newOrdersCount = 0
    let deliveredTodayCount = 0

    orders.forEach((order: any) => {
      const orderTotal = Number(order.total) || 0
      const orderTime = new Date(order.createdAt).getTime()
      const isToday = orderTime >= todayStart
      const isPaid = order.paymentStatus !== 'pending' && order.paymentStatus !== 'refunded'
      const isNotCancelled = order.orderStatus !== 'cancelled'

      if (isNotCancelled) {
        totalRevenue += orderTotal
      }

      if (isToday && isNotCancelled) {
        todayOrdersCount += 1
        if (isPaid) {
          todayRevenue += orderTotal
        }
      }

      if (order.orderStatus === 'preparing') {
        bakingCount += 1
      } else if (order.orderStatus === 'out_for_delivery') {
        outForDeliveryCount += 1
      } else if (order.orderStatus === 'new') {
        newOrdersCount += 1
      }

      if (isToday && order.orderStatus === 'delivered') {
        deliveredTodayCount += 1
      }
    })

    // Last 7 days breakdown
    const last7Days: { date: string; dayName: string; revenue: number; ordersCount: number }[] = []
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
      const dayEnd = dayStart + 24 * 60 * 60 * 1000

      let dayRev = 0
      let dayCount = 0

      orders.forEach((order: any) => {
        const orderTime = new Date(order.createdAt).getTime()
        if (orderTime >= dayStart && orderTime < dayEnd && order.orderStatus !== 'cancelled') {
          dayCount += 1
          if (order.paymentStatus !== 'pending' && order.paymentStatus !== 'refunded') {
            dayRev += Number(order.total) || 0
          }
        }
      })

      last7Days.push({
        date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        dayName: dayNames[d.getDay()],
        revenue: dayRev,
        ordersCount: dayCount,
      })
    }

    // Recent urgent/active orders (first 15)
    const activeOrders = orders.slice(0, 15).map((o: any) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      deliverySlot: o.deliverySlot,
      deliveryDate: o.deliveryDate,
      deliveryAddress: o.deliveryAddress,
      total: o.total,
      orderStatus: o.orderStatus,
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt,
      itemsCount: Array.isArray(o.items) ? o.items.reduce((acc: number, it: any) => acc + (it.quantity || 1), 0) : 0,
      itemsSummary: Array.isArray(o.items)
        ? o.items.map((it: any) => `${it.quantity}x ${it.name}${it.variantName ? ` (${it.variantName})` : ''}`).join(', ')
        : '',
      specialInstructions: o.specialInstructions || null,
    }))

    return NextResponse.json({
      success: true,
      stats: {
        todayRevenue,
        todayOrdersCount,
        totalRevenue,
        totalOrders: orders.length,
        bakingCount,
        outForDeliveryCount,
        newOrdersCount,
        deliveredTodayCount,
        soldOutProducts,
        last7Days,
        activeOrders,
      },
    })
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
