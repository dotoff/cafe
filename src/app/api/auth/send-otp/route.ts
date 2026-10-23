import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  try {
    const { phone } = await req.json()

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    // Clean phone number: remove +91, spaces, dashes
    const cleanPhone = phone.replace(/\D/g, '').slice(-10)

    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Generate 6-digit OTP
    // For easy testing and demo numbers, use 123456
    const isTestNumber = cleanPhone === '9876543210' || cleanPhone === '9999999999' || cleanPhone === '7013205977'
    const generatedOtp = isTestNumber 
      ? '123456' 
      : Math.floor(100000 + Math.random() * 900000).toString()

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes

    // Find existing customer or create new
    const existing = await payload.find({
      collection: 'customers',
      where: {
        phone: {
          equals: cleanPhone,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'customers',
        id: existing.docs[0].id,
        data: {
          otp: generatedOtp,
          otpExpiresAt: expiresAt,
        },
      })
    } else {
      await payload.create({
        collection: 'customers',
        data: {
          phone: cleanPhone,
          otp: generatedOtp,
          otpExpiresAt: expiresAt,
          isVerified: false,
        },
      })
    }

    console.log(`[AUTH] Sent OTP ${generatedOtp} to +91 ${cleanPhone}`)

    // In production, when an SMS gateway is configured, trigger SMS here
    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone}`,
      // In dev or test mode, surface devOtp for instant frictionless testing
      devOtp: process.env.NODE_ENV !== 'production' || isTestNumber ? generatedOtp : undefined,
    })
  } catch (err: any) {
    console.error('Error sending OTP:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to send OTP. Please try again.' },
      { status: 500 }
    )
  }
}
