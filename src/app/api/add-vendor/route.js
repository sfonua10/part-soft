import { connectToDB } from '@/utils/database'
import Vendor from '@/models/vendor'

export async function POST(req) {
  const { name, phone, email, primaryContact } = await req.json()

  try {
    await connectToDB()

    const newVendor = new Vendor({
      name,
      phone,
      email,
      primaryContact,
    })

    await newVendor.save()

    return new Response(JSON.stringify(newVendor), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error creating new vendor:', error)
    return new Response('Failed to create new vendor', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
