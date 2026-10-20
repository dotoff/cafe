import type { CollectionConfig } from 'payload'

const formatSlug = (val: string): string => {
  return val.replace(/ /g, '-').replace(/[^\w-]+/g, '').toLowerCase()
}

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: '🎂 Cake / Product',
    plural: '🎂 Cakes & Menu Items',
  },
  admin: {
    group: 'Bakery Kitchen',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'inStock', 'isBestSeller', 'updatedAt'],
    description: '🍰 Manage bakery items, update prices, upload photos, or toggle "In Stock / Sold Out".',
    livePreview: {
      url: ({ data }) => {
        const productSlug = data?.slug || (data?.name ? formatSlug(data.name) : '')
        return `http://localhost:3000/product/${productSlug}`
      },
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the cake or bakery treat (e.g. Belgian Chocolate Truffle Cake)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        hidden: true, // Automatically created behind the scenes so mom never has to worry about URLs
      },
      hooks: {
        beforeValidate: [
          ({ data, originalDoc }) => {
            if (data?.name) {
              return formatSlug(data.name)
            }
            return originalDoc?.slug
          },
        ],
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          admin: {
            width: '50%',
            description: 'Select which menu category this belongs to.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            width: '50%',
            description: 'Upload a clear, appetizing photo of this treat.',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Appetizing description for the customer (ingredients, flavour notes, serving suggestions).',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'inStock',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            width: '33%',
            description: '✅ In Stock (uncheck to immediately show "Sold Out" on website).',
          },
        },
        {
          name: 'isBestSeller',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            width: '33%',
            description: '⭐ Feature in "Best Sellers" section on homepage.',
          },
        },
        {
          name: 'isEggless',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            width: '34%',
            description: '🌿 100% Eggless / Pure Vegetarian.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'shelfLife',
          type: 'text',
          defaultValue: 'Consume within 3-4 days',
          admin: {
            width: '50%',
            description: 'Freshness advice (e.g. "Consume within 3 days. Keep refrigerated.")',
          },
        },
        {
          name: 'netWeight',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Weight or piece count (e.g. "500g", "1 Kg", "Box of 4 pcs")',
          },
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      required: true,
      minRows: 1,
      defaultValue: [
        { name: 'Regular', price: 199 },
      ],
      labels: {
        singular: 'Size / Flavour',
        plural: 'Sizes / Flavours & Pricing',
      },
      admin: {
        description: 'Add available sizes or portions with their prices (e.g., "500g" - ₹450, "1 Kg" - ₹850). Every item must have at least one size.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            description: 'Size name (e.g. 500g, 1 Kg, Box of 6, Regular)',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: {
            width: '50%',
            description: 'Price in ₹',
          },
        },
      ],
    },
  ],
}
