import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, currency = 'INR', receipt } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid order amount is required' }, { status: 400 })
    }

    // Retrieve Razorpay keys from environment variables or StoreSettings CMS
    let keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    let keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      try {
        const payload = await getPayload({ config: configPromise })
        const settings: any = await payload.findGlobal({ slug: 'store-settings' })
        if (settings?.razorpayKeyId) keyId = keyId || settings.razorpayKeyId
        if (settings?.razorpayKeySecret) keySecret = keySecret || settings.razorpayKeySecret
      } catch (settingsErr) {
        console.warn('Could not read store-settings for Razorpay keys:', settingsErr)
      }
    }

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error:
            'Razorpay API Keys are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env or the Admin Dashboard.',
        },
        { status: 500 }
      )
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    // Razorpay requires amount in the smallest currency sub-unit (paise for INR, i.e. amount * 100)
    const amountInPaise = Math.round(Number(amount) * 100)

    const options = {
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    }

    const order = await instance.orders.create(options)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    })
  } catch (error: any) {
    console.error('Razorpay order creation error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create Razorpay order' },
      { status: 500 }
    )
  }
}
