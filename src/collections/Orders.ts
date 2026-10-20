import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: '📦 Order',
    plural: '📦 Orders & Deliveries',
  },
  admin: {
    group: 'Bakery Kitchen',
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'total', 'orderStatus', 'paymentStatus', 'createdAt'],
    description: '📋 Track incoming bakery orders, update oven baking status, and organize delivery packing.',
  },
  access: {
    create: () => true, // Customers can submit orders via checkout API
    read: () => true,
    update: ({ req: { user } }) => Boolean(user), // Authenticated staff only
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      index: true,
      validate: async (val: unknown, { req, id }: { req?: any; id?: string | number } = {}) => {
        if (!val || typeof val !== 'string') return 'Order number is required'
        if (!req?.payload) return true
        try {
          const existing = await req.payload.find({
            collection: 'orders',
            where: {
              orderNumber: { equals: val },
              ...(id ? { id: { not_equals: id } } : {}),
            },
            limit: 1,
          })
          if (existing?.docs?.length > 0) return 'An order with this order number already exists.'
        } catch {
          return true
        }
        return true
      },
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
            { label: '🆕 New Order (Received)', value: 'new' },
            { label: '✅ Confirmed', value: 'confirmed' },
            { label: '🧁 In the Oven / Baking', value: 'preparing' },
            { label: '🛵 Out for Delivery (Rider Dispatched)', value: 'out_for_delivery' },
            { label: '🎉 Delivered Successfully', value: 'delivered' },
            { label: '❌ Cancelled', value: 'cancelled' },
          ],
          admin: {
            width: '50%',
            description: '👉 Change status as you prepare and dispatch the order.',
          },
        },
        {
          name: 'paymentStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: '⏳ Pending Payment', value: 'pending' },
            { label: '💳 Paid (Razorpay Online)', value: 'paid_razorpay' },
            { label: '📱 Paid (UPI / WhatsApp)', value: 'paid_upi' },
            { label: '💵 Cash on Delivery', value: 'paid_cod' },
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
          label: '🍰 What to Bake & Pack',
          description: 'Items ordered and special instructions for the kitchen.',
          fields: [
            {
              name: 'specialInstructions',
              type: 'textarea',
              admin: {
                description: '⚠️ Special cake messages, custom notes, or dietary preferences requested by the customer (e.g. "Write Happy Birthday Rohit", "Eggless only").',
              },
            },
            {
              name: 'items',
              type: 'array',
              required: true,
              labels: {
                singular: 'Item',
                plural: 'Ordered Items',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '40%', description: 'Product' } },
                    { name: 'variantName', type: 'text', admin: { width: '25%', description: 'Size / Flavour' } },
                    { name: 'quantity', type: 'number', required: true, admin: { width: '15%', description: 'Qty' } },
                    { name: 'price', type: 'number', required: true, admin: { width: '20%', description: 'Price (₹)' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: '📍 Customer & Delivery',
          description: 'Customer contact info, delivery address, date, and time slot.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'customerName',
                  type: 'text',
                  required: true,
                  admin: { width: '50%', description: 'Customer Name' },
                },
                {
                  name: 'customerPhone',
                  type: 'text',
                  required: true,
                  admin: { width: '50%', description: 'Phone Number (for call or WhatsApp)' },
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
                    description: '📅 Requested Delivery Date',
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
                    description: '⏰ Requested Time Slot',
                  },
                },
              ],
            },
            {
              name: 'deliveryAddress',
              type: 'textarea',
              required: true,
              admin: { description: 'Complete street address, apartment / flat number' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'landmark',
                  type: 'text',
                  admin: { width: '34%', description: 'Landmark' },
                },
                {
                  name: 'city',
                  type: 'text',
                  defaultValue: 'Samalkot',
                  admin: { width: '33%', description: 'City' },
                },
                {
                  name: 'state',
                  type: 'text',
                  defaultValue: 'Andhra Pradesh',
                  admin: { width: '33%', description: 'State' },
                },
              ],
            },
            {
              name: 'pincode',
              type: 'text',
              required: true,
              admin: { description: 'Pincode (6 digits)' },
            },
            {
              name: 'customerEmail',
              type: 'email',
              admin: { description: 'Customer Email (for automated invoice & updates)' },
            },
          ],
        },
        {
          label: '💰 Billing & Payment',
          description: 'Payment breakdown and transaction references.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'subtotal', type: 'number', required: true, admin: { width: '25%', description: 'Subtotal (₹)' } },
                { name: 'tax', type: 'number', defaultValue: 0, admin: { width: '25%', description: 'GST (₹)' } },
                { name: 'shipping', type: 'number', defaultValue: 0, admin: { width: '25%', description: 'Delivery (₹)' } },
                { name: 'total', type: 'number', required: true, admin: { width: '25%', description: 'Grand Total (₹)' } },
              ],
            },
            {
              name: 'paymentMethod',
              type: 'select',
              defaultValue: 'razorpay',
              options: [
                { label: 'Razorpay Online (UPI/Cards/Netbanking)', value: 'razorpay' },
                { label: 'Cash on Delivery', value: 'cod' },
                { label: 'Direct UPI / WhatsApp', value: 'upi_whatsapp' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'razorpayOrderId',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Razorpay Order ID',
                  },
                },
                {
                  name: 'razorpayPaymentId',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Razorpay Payment Receipt ID',
                  },
                },
              ],
            },
          ],
        },
        {
          label: '🚚 Courier & Shiprocket',
          description: 'Shiprocket logistics and live AWB tracking info.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'courierName',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Assigned Courier (e.g. BlueDart, Delhivery, Dunzo, Shadowfax)',
                  },
                },
                {
                  name: 'awbCode',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Courier Tracking / AWB Code',
                  },
                },
              ],
            },
            {
              name: 'trackingUrl',
              type: 'text',
              admin: {
                description: 'Live Courier Tracking Link',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'shiprocketOrderId',
                  type: 'text',
                  admin: {
                    width: '33%',
                    description: 'Shiprocket Order ID',
                  },
                },
                {
                  name: 'shiprocketShipmentId',
                  type: 'text',
                  admin: {
                    width: '33%',
                    description: 'Shipment ID',
                  },
                },
                {
                  name: 'shiprocketStatus',
                  type: 'text',
                  admin: {
                    width: '34%',
                    description: 'Courier Sync Status',
                  },
                },
              ],
            },
          ],
        },
        {
          label: '📝 Kitchen Notes',
          description: 'Private bakery notes and reminders.',
          fields: [
            {
              name: 'adminNotes',
              type: 'textarea',
              admin: {
                description: 'Private kitchen reminders (e.g. "Sent with Dunzo runner Suresh", "Customer called to request 4pm delivery").',
              },
            },
          ],
        },
      ],
    },
  ],
}
