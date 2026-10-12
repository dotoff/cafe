import { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    description: 'Manage your product categories (e.g. Chocolates, Hampers)',
    livePreview: {
      url: ({ data }) => `http://localhost:3000/shop?category=${data.slug || ''}`,
    }
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
        description: 'The name of the category as it will appear on the website.',
      }
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'The URL-friendly version of the name (e.g., "gift-hampers"). No spaces allowed.',
      }
    },
    {
      name: 'emoji',
      type: 'text',
      admin: {
        description: 'Paste a single emoji to represent this category (e.g. 🍫, 🍪, 🎁). On Windows, press the [Windows Key] + [.] to open the emoji picker.',
      }
    },
    {
      name: 'colorTheme',
      type: 'text',
      defaultValue: '#5D4037',
      admin: {
        description: 'Choose a beautiful background color for this category card.',
        components: {
          Field: '@/components/ColorPicker#ColorPicker',
        }
      }
    },
  ],
}
