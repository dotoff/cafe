'use server'

import { handleServerFunctions } from '@payloadcms/next/layouts'
import configPromise from '@payload-config'

import { ColorPicker } from '@/components/ColorPicker'

export const serverFunction = async (args: any) => {
  const config = await configPromise
  return handleServerFunctions({ 
    ...args, 
    config, 
    importMap: { "@/components/ColorPicker#ColorPicker": ColorPicker } 
  })
}
