import { getPayload } from 'payload'
import configPromise from '@payload-config'

let cachedToken: string | null = null
let tokenExpiresAt = 0

export interface ShiprocketConfig {
  email: string
  password: string
  pickupLocation: string
  defaultWeight: number
  autoPush: boolean
}

export async function getShiprocketSettings(): Promise<ShiprocketConfig | null> {
  let email = process.env.SHIPROCKET_EMAIL || ''
  let password = process.env.SHIPROCKET_PASSWORD || ''
  let pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary'
  let defaultWeight = Number(process.env.SHIPROCKET_DEFAULT_WEIGHT || 0.5)
  let autoPush = true

  try {
    const payload = await getPayload({ config: configPromise })
    const settings: any = await payload.findGlobal({ slug: 'store-settings' })
    if (settings?.shiprocketEmail) email = email || settings.shiprocketEmail
    if (settings?.shiprocketPassword) password = password || settings.shiprocketPassword
    if (settings?.shiprocketPickupLocation) pickupLocation = settings.shiprocketPickupLocation
    if (settings?.shiprocketDefaultWeight) defaultWeight = Number(settings.shiprocketDefaultWeight)
    if (typeof settings?.shiprocketAutoPush === 'boolean') {
      autoPush = settings.shiprocketAutoPush
    }
  } catch (err) {
    console.warn('Could not read store-settings for Shiprocket:', err)
  }

  if (!email || !password) {
    return null
  }

  return {
    email: email.trim(),
    password: password.trim(),
    pickupLocation: pickupLocation.trim() || 'Primary',
    defaultWeight: defaultWeight > 0 ? defaultWeight : 0.5,
    autoPush,
  }
}

export async function getShiprocketToken(config: ShiprocketConfig): Promise<string> {
  const now = Date.now()
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken
  }

  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: config.email,
      password: config.password,
    }),
  })

  const data = await res.json()

  if (!res.ok || !data?.token) {
    throw new Error(data?.message || 'Failed to authenticate with Shiprocket API')
  }

  cachedToken = data.token
  // Cache token for 24 hours (Shiprocket tokens last up to 10 days)
  tokenExpiresAt = now + 24 * 60 * 60 * 1000
  return data.token
}

export async function pushOrderToShiprocket(order: any) {
  try {
    const srConfig = await getShiprocketSettings()
    if (!srConfig) {
      return {
        pushed: false,
        status: 'Shiprocket credentials not configured yet (set in Admin -> Store Settings -> Shiprocket Logistics)',
      }
    }

    const token = await getShiprocketToken(srConfig)

    // Split full name into first and last name
    const fullName = (order.customerName || 'Valued Customer').trim()
    const nameParts = fullName.split(/\s+/)
    const firstName = nameParts[0] || 'Customer'
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '.'

    // Format date as YYYY-MM-DD HH:MM
    const d = order.createdAt ? new Date(order.createdAt) : new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const orderDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`

    // Clean phone to 10 digits for Shiprocket
    const cleanPhone = String(order.customerPhone || '')
      .replace(/\D/g, '')
      .slice(-10)

    const orderItems = (order.items || []).map((item: any, idx: number) => ({
      name: `${item.name}${
        item.variantName && item.variantName !== 'Standard' ? ` (${item.variantName})` : ''
      }`,
      sku: `FLV-ITEM-${idx + 1}`,
      units: Number(item.quantity) || 1,
      selling_price: String(Number(item.price) || 0),
      discount: '0',
      tax: '0',
    }))

    const payloadBody = {
      order_id: order.orderNumber,
      order_date: orderDate,
      pickup_location: srConfig.pickupLocation || 'Primary',
      comment: order.specialInstructions || 'Fresh Bakery Order - Handle with care',
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: order.deliveryAddress || 'Address provided',
      billing_address_2: order.landmark || '',
      billing_city: order.city || 'Hyderabad',
      billing_pincode: String(order.pincode || '500001').trim(),
      billing_state: order.state || 'Telangana',
      billing_country: 'India',
      billing_email: order.customerEmail || 'orders@flavourite.in',
      billing_phone: cleanPhone || '9876543210',
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
      shipping_charges: Number(order.shipping || 0),
      sub_total: Number(order.subtotal || order.total || 0) + Number(order.tax || 0),
      length: 15,
      breadth: 15,
      height: 10,
      weight: srConfig.defaultWeight || 0.5,
    }

    const createRes = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payloadBody),
    })

    const result = await createRes.json()

    if (!createRes.ok || !result?.order_id) {
      const errMsg =
        result?.message ||
        (result?.errors ? JSON.stringify(result.errors) : 'Shiprocket order creation failed')
      return {
        pushed: false,
        status: `Shiprocket Error: ${errMsg}`,
      }
    }

    const srOrderId = String(result.order_id)
    const srShipmentId = result.shipment_id ? String(result.shipment_id) : undefined
    const awbCode = result.awb_code ? String(result.awb_code) : undefined
    const courierName = result.courier_name ? String(result.courier_name) : undefined

    return {
      pushed: true,
      shiprocketOrderId: srOrderId,
      shiprocketShipmentId: srShipmentId,
      awbCode,
      courierName,
      trackingUrl: awbCode ? `https://shiprocket.co/tracking/${awbCode}` : undefined,
      status: result.status || 'Synced to Shiprocket (NEW)',
    }
  } catch (err: any) {
    console.error('Error pushing order to Shiprocket:', err)
    return {
      pushed: false,
      status: `Shiprocket Sync Error: ${err?.message || 'Unknown error'}`,
    }
  }
}

export async function fetchShiprocketTracking(shipmentId: string) {
  try {
    const srConfig = await getShiprocketSettings()
    if (!srConfig || !shipmentId) return null

    const token = await getShiprocketToken(srConfig)
    const res = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${encodeURIComponent(
        shipmentId
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!res.ok) return null
    const data = await res.json()
    return data
  } catch (e) {
    return null
  }
}
