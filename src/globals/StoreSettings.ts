import { GlobalConfig } from 'payload'

export const StoreSettings: GlobalConfig = {
  slug: 'store-settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'storeName', type: 'text', defaultValue: 'Flavourite' },
            { name: 'contactEmail', type: 'text' },
            { name: 'businessAddress', type: 'textarea' },
            { 
              name: 'announcementBarText', 
              type: 'text', 
              admin: { description: 'Text for the top banner (e.g. "Free shipping over ₹500!")' } 
            },
            { name: 'announcementBarActive', type: 'checkbox', defaultValue: false },
          ]
        },
        {
          label: 'Checkout & Razorpay',
          fields: [
            { 
              name: 'whatsappNumber', 
              type: 'text', 
              required: true,
              defaultValue: '917013205977', 
              admin: { description: 'Store contact number (e.g. 917013205977)' } 
            },
            {
              name: 'upiId',
              type: 'text',
              defaultValue: '7013205977@upi',
              admin: { description: 'Optional store UPI ID.' }
            },
            {
              name: 'razorpayKeyId',
              type: 'text',
              admin: { description: 'Razorpay Key ID (rzp_live_... or rzp_test_...). Paste here to activate Razorpay checkout.' }
            },
            {
              name: 'razorpayKeySecret',
              type: 'text',
              admin: { description: 'Razorpay Key Secret (found in Razorpay Dashboard -> Settings -> API Keys). Keep this confidential.' }
            },
            { 
              name: 'taxRate', 
              type: 'number', 
              defaultValue: 5, 
              admin: { description: 'GST/Tax percentage to add to the cart.' } 
            },
            { 
              name: 'shippingFlatRate', 
              type: 'number', 
              defaultValue: 50,
              admin: { description: 'Standard shipping cost.' }
            },
            { 
              name: 'freeShippingThreshold', 
              type: 'number', 
              defaultValue: 500,
              admin: { description: 'Cart subtotal required to get free shipping.' }
            },
          ]
        },
        {
          label: 'Shiprocket Logistics',
          fields: [
            {
              name: 'shiprocketAutoPush',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Automatically push every paid order to Shiprocket immediately after Razorpay payment verification.',
              },
            },
            {
              name: 'shiprocketEmail',
              type: 'text',
              admin: {
                description: 'Shiprocket API User Email (Create in Shiprocket Panel -> Settings -> API -> Add New API User).',
              },
            },
            {
              name: 'shiprocketPassword',
              type: 'text',
              admin: {
                description: 'Shiprocket API User Password.',
              },
            },
            {
              name: 'shiprocketPickupLocation',
              type: 'text',
              defaultValue: 'Primary',
              admin: {
                description: 'Exact name of your Pickup Location in Shiprocket (e.g. "Primary", "Home", "Bakery").',
              },
            },
            {
              name: 'shiprocketDefaultWeight',
              type: 'number',
              defaultValue: 0.5,
              admin: {
                description: 'Default package weight in Kilograms (e.g. 0.5 for 500g).',
              },
            },
          ],
        },
        {
          label: 'Social Media',
          fields: [
            { name: 'instagramUrl', type: 'text' },
            { name: 'facebookUrl', type: 'text' },
          ]
        }
      ]
    }
  ]
}
