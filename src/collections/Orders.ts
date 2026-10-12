import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'total', 'paymentStatus', 'orderStatus', 'createdAt'],
    description: 'Track and manage incoming customer orders and fulfillment.',
  },
  access: {
    create: () => true, // Customers can submit orders via checkout API
    read: () => true,
    update: ({ req: { user } }) => Boolean(user), // Only admin/mom can update order status
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated unique Order ID (e.g. FLV-1001)',
        readOnly: true,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'orderStatus',
          type: 'select',
          defaultValue: 'new',
          options: [
            { label: '🆕 New Order', value: 'new' },
            { label: '✅ Confirmed', value: 'confirmed' },
            { label: '🧁 Baking / Preparing', value: 'preparing' },
            { label: '🛵 Out for Delivery', value: 'out_for_delivery' },
            { label: '🎉 Delivered', value: 'delivered' },
            { label: '❌ Cancelled', value: 'cancelled' },
          ],
          admin: {
            width: '50%',
            description: 'Current order fulfillment status.',
          },
        },
        {
          name: 'paymentStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: '⏳ Pending Payment', value: 'pending' },
            { label: '📱 Paid (UPI / WhatsApp Verified)', value: 'paid_upi' },
            { label: '💳 Paid (Razorpay Online)', value: 'paid_razorpay' },
            { label: '💵 Cash / Pay on Delivery', value: 'paid_cod' },
            { label: '↩️ Refunded', value: 'refunded' },
          ],
          admin: {
            width: '50%',
            description: 'Payment verification status.',
          },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Customer & Delivery',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'customerName',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'customerPhone',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'customerEmail',
              type: 'email',
              admin: { description: 'For sending invoice & order confirmation.' },
            },
            {
              name: 'deliveryAddress',
              type: 'textarea',
              required: true,
              admin: { description: 'Complete street address, apartment, flat/house number.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'landmark',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'pincode',
                  type: 'text',
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'deliveryDate',
                  type: 'date',
                  admin: {
                    width: '50%',
                    description: 'Preferred delivery date requested by the customer.',
                  },
                },
                {
                  name: 'deliverySlot',
                  type: 'select',
                  options: [
                    { label: '🌅 Morning (10:00 AM - 1:00 PM)', value: 'morning' },
                    { label: '☀️ Afternoon (1:00 PM - 5:00 PM)', value: 'afternoon' },
                    { label: '🌙 Evening (5:00 PM - 9:00 PM)', value: 'evening' },
                    { label: '⚡ ASAP / Standard Delivery', value: 'asap' },
                  ],
                  defaultValue: 'asap',
                  admin: {
                    width: '50%',
                    description: 'Preferred delivery time slot.',
                  },
                },
              ],
            },
            {
              name: 'specialInstructions',
              type: 'textarea',
              admin: {
                description: 'Special requests (e.g. "Eggless only", "Write Happy Birthday Rohit on cake", "Call before arriving").',
              },
            },
          ],
        },
        {
          label: 'Order Items & Payment',
          fields: [
            {
              name: 'items',
              type: 'array',
              required: true,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '35%' } },
                    { name: 'variantName', type: 'text', admin: { width: '25%' } },
                    { name: 'price', type: 'number', required: true, admin: { width: '20%' } },
                    { name: 'quantity', type: 'number', required: true, admin: { width: '20%' } },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'subtotal', type: 'number', required: true, admin: { width: '25%' } },
                { name: 'tax', type: 'number', defaultValue: 0, admin: { width: '25%' } },
                { name: 'shipping', type: 'number', defaultValue: 0, admin: { width: '25%' } },
                { name: 'total', type: 'number', required: true, admin: { width: '25%' } },
              ],
            },
            {
              name: 'paymentMethod',
              type: 'select',
              defaultValue: 'upi_whatsapp',
              options: [
                { label: 'UPI / WhatsApp Pay', value: 'upi_whatsapp' },
                { label: 'Razorpay (Cards/UPI/Netbanking)', value: 'razorpay' },
                { label: 'Cash on Delivery', value: 'cod' },
              ],
            },
            {
              name: 'razorpayOrderId',
              type: 'text',
              admin: {
                description: 'Razorpay Order ID when payment is processed via Razorpay.',
              },
            },
            {
              name: 'razorpayPaymentId',
              type: 'text',
              admin: {
                description: 'Razorpay Payment ID receipt.',
              },
            },
          ],
        },
        {
          label: 'Internal Notes',
          fields: [
            {
              name: 'adminNotes',
              type: 'textarea',
              admin: {
                description: 'Private kitchen/delivery notes (e.g. "Sent via Dunzo #9283", "Customer requested 5pm delivery").',
              },
            },
          ],
        },
      ],
    },
  ],
}
