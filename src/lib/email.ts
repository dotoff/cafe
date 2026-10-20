/**
 * Automated Transactional Email Notification Utility
 * Uses Resend's REST API (Free 3,000 emails/month) with zero extra npm dependencies.
 */

interface SendOrderEmailParams {
  order: any
  settings: any
}

export async function sendOrderConfirmationEmails({ order, settings }: SendOrderEmailParams) {
  try {
    const resendApiKey = settings?.resendApiKey || process.env.RESEND_API_KEY
    const fromEmail = settings?.fromEmail || 'Flavourite Bakery <onboarding@resend.dev>'
    const staffEmail = settings?.staffNotificationEmail || settings?.contactEmail

    const customerEmail = order.customerEmail

    const itemsHtml = (order.items || [])
      .map(
        (it: any) => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
            <strong>${it.name}</strong> ${it.variantName ? `<span style="color:#6b7280;">(${it.variantName})</span>` : ''}
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: center;">${it.quantity}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">₹${it.price * it.quantity}</td>
        </tr>
      `
      )
      .join('')

    const trackingUrl = `https://flavouritefood.com/track-order?id=${encodeURIComponent(order.orderNumber)}`

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmed - Flavourite Bakery</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FFF8F0; margin: 0; padding: 24px; color: #1f2937;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #f3f4f6; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          <!-- Header -->
          <div style="background: #1B5E20; padding: 32px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 26px; font-family: Georgia, serif; letter-spacing: 0.5px;">Flavourite Cafe & Bakery</h1>
            <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Freshly Baked with Love in Hyderabad</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="display: inline-block; background: #DCFCE7; color: #15803D; font-weight: bold; font-size: 12px; padding: 6px 14px; border-radius: 999px; text-transform: uppercase;">
                ✓ Payment Verified & Order Confirmed
              </span>
              <h2 style="margin: 12px 0 4px 0; font-size: 22px; color: #111827;">Thank you, ${order.customerName}!</h2>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Order Reference: <strong>#${order.orderNumber}</strong></p>
            </div>

            <!-- Delivery Details Box -->
            <div style="background: #FFF8F0; border: 1px solid #f5ede3; border-radius: 14px; padding: 16px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; color: #1B5E20; letter-spacing: 0.05em;">Delivery Information</h3>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Address:</strong> ${order.deliveryAddress}</p>
              ${order.landmark ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Landmark:</strong> ${order.landmark}</p>` : ''}
              <p style="margin: 4px 0; font-size: 14px;"><strong>Pincode:</strong> ${order.pincode} (${order.city || 'Hyderabad'})</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Time Slot:</strong> ${order.deliverySlot?.toUpperCase() || 'ASAP'}</p>
              ${order.specialInstructions ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #854d0e; background: #fef9c3; padding: 6px 10px; border-radius: 6px;"><strong>Note:</strong> "${order.specialInstructions}"</p>` : ''}
            </div>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
              <thead>
                <tr style="border-bottom: 2px solid #e5e7eb; color: #6b7280; text-align: left;">
                  <th style="padding-bottom: 8px;">Item</th>
                  <th style="padding-bottom: 8px; text-align: center;">Qty</th>
                  <th style="padding-bottom: 8px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Summary -->
            <div style="border-top: 2px solid #e5e7eb; padding-top: 14px; margin-bottom: 28px;">
              <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
                <span style="color: #6b7280;">Subtotal</span>
                <span>₹${order.subtotal}</span>
              </div>
              ${order.tax ? `<div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;"><span style="color: #6b7280;">GST</span><span>₹${order.tax}</span></div>` : ''}
              <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px;">
                <span style="color: #6b7280;">Delivery</span>
                <span>${order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #1B5E20; padding-top: 8px; border-top: 1px solid #f3f4f6;">
                <span>Total Paid</span>
                <span>₹${order.total}</span>
              </div>
            </div>

            <!-- CTA -->
            <div style="text-align: center;">
              <a href="${trackingUrl}" style="display: inline-block; background: #1B5E20; color: #ffffff; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 14px;">
                Track Live Order Status →
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 20px 24px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6;">
            <p style="margin: 0;">Flavourite Cafe & Bakery • Banjara Hills, Hyderabad • Call/WhatsApp: +91 70132 05977</p>
          </div>
        </div>
      </body>
      </html>
    `

    if (!resendApiKey) {
      console.log(`[Email Service] Resend API key not configured. Mock email generated for order #${order.orderNumber} to ${customerEmail || staffEmail}.`)
      return { success: true, simulated: true }
    }

    // 1. Send to Customer (if email provided)
    if (customerEmail) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: customerEmail,
          subject: `🧁 Order Confirmed #${order.orderNumber} - Flavourite Bakery`,
          html: emailHtml,
        }),
      })
    }

    // 2. Send Alert to Kitchen Staff
    if (staffEmail && staffEmail !== customerEmail) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: staffEmail,
          subject: `🔔 NEW ORDER #${order.orderNumber} (₹${order.total}) - ${order.customerName}`,
          html: emailHtml,
        }),
      })
    }

    return { success: true }
  } catch (err) {
    console.error('Non-fatal error sending order confirmation email:', err)
    return { success: false, error: err }
  }
}
