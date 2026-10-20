import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: '📸 Photo',
    plural: '📸 Bakery Photo Library',
  },
  admin: {
    group: 'Bakery Kitchen',
    description: 'Upload and manage product photos, banners, and logo images.',
  },
  upload: {
    staticDir: process.env.VERCEL ? '/tmp/media' : './media',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Photo description (e.g. "Chocolate Truffle Cake with Gold Flakes").',
      },
    },
  ],
}
