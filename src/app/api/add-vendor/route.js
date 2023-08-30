import { connectToDB } from '@/utils/database'
import Vendor from '@/models/vendor'

export async function POST(req) {
  // Destructure all the needed fields from the request
  const { name, phone, email, primaryContact, specialization, isActive, isSaved } = await req.json()
  if (name === "ErrorTest") {
    throw new Error("This is a test error!")
  }
  try {
    await connectToDB()

    const newVendor = new Vendor({
      name,
      phone,
      email,
      primaryContact,
      specialization,
      isActive,
      isSaved
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
