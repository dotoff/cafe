/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { Metadata } from 'next'

import config from '@payload-config'
import '@payloadcms/next/css'
import './admin.css'
import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { serverFunction } from './serverFunction'
import { ColorPicker } from '@/components/ColorPicker'

export const metadata: Metadata = {
  title: 'Flavourite Bakery Admin',
}

const Layout = ({ children }: { children: React.ReactNode }) => (
  <RootLayout 
    config={config} 
    importMap={{
      "@/components/ColorPicker#ColorPicker": ColorPicker
    }}
    serverFunction={serverFunction}
  >
    {children}
  </RootLayout>
)

export default Layout
