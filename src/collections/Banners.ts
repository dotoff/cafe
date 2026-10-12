import { CollectionConfig } from 'payload'

export const Banners: CollectionConfig = {
  slug: 'banners',
  admin: {
    useAsTitle: 'title',
    description: 'Manage the large promotional banners on the homepage.',
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
        description: 'Main headline for the banner.',
      }
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'A short paragraph describing the offer or highlight.',
      }
    },
    {
      name: 'buttonText',
      type: 'text',
      admin: {
        description: 'Text for the clickable button (e.g., "Shop Now").',
      }
    },
    {
      name: 'buttonLink',
      type: 'text',
      admin: {
        description: 'Where the button should take the user (e.g., "/shop?category=hampers").',
      }
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload a beautiful, high-quality image for the banner.',
      }
    },
    {
      name: 'colorTheme',
      type: 'text',
      defaultValue: '#FDFBF7',
      admin: {
        description: 'Select the background color theme for this banner section.',
        components: {
          Field: '@/components/ColorPicker#ColorPicker',
        }
      }
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Check this box to show this banner on the live website.',
      }
    },
  ],
}
