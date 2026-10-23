import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
  response.cookies.delete('flavourite_customer_session')
  return response
}
