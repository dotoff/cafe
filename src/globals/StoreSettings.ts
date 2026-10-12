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
          label: 'Checkout, Payments & WhatsApp',
          fields: [
            { 
              name: 'whatsappNumber', 
              type: 'text', 
              required: true,
              defaultValue: '917013205977', 
              admin: { description: 'The phone number to receive orders. Include country code without + (e.g. 917013205977)' } 
            },
            {
              name: 'upiId',
              type: 'text',
              defaultValue: '7013205977@upi',
              admin: { description: 'UPI ID for QR Code and direct customer payments (e.g. 7013205977@upi or yourname@okhdfcbank).' }
            },
            {
              name: 'razorpayKeyId',
              type: 'text',
              admin: { description: 'Razorpay Key ID (rzp_live_... or rzp_test_...). Once approved by Razorpay, paste it here to activate online card/netbanking payments.' }
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
