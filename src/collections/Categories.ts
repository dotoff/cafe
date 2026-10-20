import { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: '🏷️ Category',
    plural: '🏷️ Menu Categories',
  },
  admin: {
    group: 'Bakery Kitchen',
    useAsTitle: 'title',
    description: 'Organize your bakery treats into categories (e.g. Cakes, Chocolates, Cookies, Hampers).',
    livePreview: {
      url: ({ data }) => `http://localhost:3000/shop?category=${data.slug || ''}`,
    },
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
        description: 'Category name (e.g. Chocolates, Cakes, Gift Hampers)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL key for filtering (e.g. "chocolates", "hampers"). No spaces.',
      },
    },
    {
      name: 'emoji',
      type: 'text',
      admin: {
        description: 'A single emoji to show on the website (e.g. 🍫, 🎂, 🍪, 🎁). On Windows, press [Windows Key] + [.] to open emoji picker.',
      },
    },
    {
      name: 'colorTheme',
      type: 'text',
      defaultValue: '#5D4037',
      admin: {
        description: 'Choose a background color for this category card.',
        components: {
          Field: '@/components/ColorPicker#ColorPicker',
        },
      },
    },
  ],
}
