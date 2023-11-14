import { connectToDB } from '@/utils/database'
import Vendor from '@/models/vendor'
import mongoose from 'mongoose';
import { formatToE164 } from '@/utils/formatToE164';

export async function POST(req) {
  // Destructure all the needed fields from the request
  const { organizationId, name, phone, email, primaryContact, specialization } = await req.json()
  if (!mongoose.Types.ObjectId.isValid(organizationId)) {
    return new Response('Invalid organizationId provided', {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (name === "ErrorTest") {
    throw new Error("This is a test error!")
  }
  try {
    await connectToDB()
    // Format the phone number to E.164 if it doesn't start with a '+'
    const formattedPhone = formatToE164(phone);
    const newVendor = new Vendor({
      organizationId,
      name,
      phone: formattedPhone,
      email,
      primaryContact,
      specialization
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
