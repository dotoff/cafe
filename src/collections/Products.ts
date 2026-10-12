import type { CollectionConfig } from 'payload'

const formatSlug = (val: string): string => {
  return val.replace(/ /g, '-').replace(/[^\w-]+/g, '').toLowerCase()
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    livePreview: {
      url: ({ data }) => {
        const productSlug = data?.slug || (data?.name ? formatSlug(data.name) : '')
        return `http://localhost:3000/product/${productSlug}`
      },
    }
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
        description: 'The name of the product (e.g. Chocolate Ice Cream)',
      }
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        hidden: true, // Hide it entirely so mom never sees it!
      },
      hooks: {
        beforeValidate: [
          ({ data, originalDoc }) => {
            if (data?.name) {
              return formatSlug(data.name)
            }
            return originalDoc?.slug
          }
        ]
      }
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'isBestSeller',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Highlight this product in the Best Sellers section on the homepage.',
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
            width: '50%',
            description: 'In Stock (uncheck to mark as "Sold Out" on the website).',
          },
        },
        {
          name: 'isEggless',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            width: '50%',
            description: '100% Eggless / Vegetarian badge.',
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
            description: 'Storage / freshness note (e.g. "Consume within 3 days. Keep cool.")',
          },
        },
        {
          name: 'netWeight',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Weight or piece count (e.g. "250g", "Box of 4 pcs")',
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
        { name: 'Regular', price: 199 }
      ],
      labels: {
        singular: 'Product Option / Size',
        plural: 'Product Options / Sizes'
      },
      admin: {
        description: 'Add the different sizes or flavors here. (e.g., "100g", "250g", "Box of 4"). Every product needs at least one option, such as "Regular".',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Label for this option (e.g., 100g, Regular, Vanilla)',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
      ],
    }
  ],
}
