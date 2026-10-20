import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: '👤 Staff User',
    plural: '👥 Staff & Admins',
  },
  admin: {
    group: 'Settings',
    useAsTitle: 'email',
    description: 'Manage admin logins and staff accounts.',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Staff member name',
      },
    },
  ],
}
