import { CollectionConfig } from 'payload'

export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: {
    singular: '🖼️ Hero Banner',
    plural: '🖼️ Homepage Banners',
  },
  admin: {
    group: 'Storefront',
    useAsTitle: 'title',
    description: 'Promotional banners and announcements featured at the top of the homepage carousel.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Main headline for the banner (e.g. "Diwali Special Handcrafted Hampers").',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short promotional offer or highlight subtitle.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'buttonText',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Button text (e.g. "Shop Hampers", "Explore Cakes").',
          },
        },
        {
          name: 'buttonLink',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Link destination (e.g. "/shop?category=hampers").',
          },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload banner background photo.',
      },
    },
    {
      name: 'colorTheme',
      type: 'text',
      defaultValue: '#FDFBF7',
      admin: {
        description: 'Section theme background color.',
        components: {
          Field: '@/components/ColorPicker#ColorPicker',
        },
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this banner on the live website.',
      },
    },
  ],
}
