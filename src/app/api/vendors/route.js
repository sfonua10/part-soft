import Vendor from '@/models/vendor'
import User from '@/models/user'
import mongoose from 'mongoose'
import { formatToE164 } from '@/utils/formatToE164'
import { connectToDB } from '@/utils/database'
// Ensure that the 'organizationId' field in the Vendor model is indexed
Vendor.schema.index({ organizationId: 1 });

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    if (!userId) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const user = await User.findById(userId).catch(err => {
      console.error('Error fetching user:', err.message);
      throw new Error('User fetch failed');
    });
    
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!user.organizationId) {
      return new Response(
        JSON.stringify({
          message: 'User is not associated with any organization',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Limit the fields returned for each vendor
    const vendors = await Vendor.find({ organizationId: user.organizationId })
    .select('_id name phone email primaryContact specialization');
  
    return new Response(JSON.stringify(vendors), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching vendors:', error.message)
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(req) {
  const { organizationId, name, phone, email, primaryContact, specialization } =
    await req.json()
  if (!mongoose.Types.ObjectId.isValid(organizationId)) {
    return new Response('Invalid organizationId provided', {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (name === 'ErrorTest') {
    throw new Error('This is a test error!')
  }
  try {
    await connectToDB()
    // Format the phone number to E.164 if it doesn't start with a '+'
    const formattedPhone = formatToE164(phone)
    const newVendor = new Vendor({
      organizationId,
      name,
      phone: formattedPhone,
      email,
      primaryContact,
      specialization,
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

export async function PUT(req) {
  try {
    const { _id, name, phone, email, primaryContact, specialization } =
      await req.json()

    if (!_id) {
      console.error('Vendor ID missing in request body')
      return new Response('Vendor ID is required for update', {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (name === 'ErrorTest') {
      throw new Error('This is a test error!')
    }

    await connectToDB()

    // Format the phone number to E.164 if it doesn't start with a '+'
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`
    const updateValues = {
      name,
      phone: formattedPhone,
      email,
      primaryContact,
      specialization,
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(_id, updateValues, {
      new: true,
    }) // { new: true } ensures that the updated document is returned

    if (!updatedVendor) {
      console.error('Vendor with given ID not found in database:', _id)
      return new Response('Vendor not found', {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(updatedVendor), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error updating vendor:', error)
    return new Response('Failed to update vendor', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function DELETE(request) {
  const { _id } = await request.json()

  try {
    const objectId = new mongoose.Types.ObjectId(_id);
    const result = await Vendor.deleteOne({ _id: objectId }).catch(err => {
      console.error('Error deleting vendor:', err.message);
      throw new Error('Vendor deletion failed');
    });
    

    if (result.deletedCount > 0) {
      return new Response(
        JSON.stringify({ message: 'Vendor deleted successfully.' }),
        { status: 200 },
      )
    } else {
      return new Response(JSON.stringify({ message: 'Vendor not found.' }), {
        status: 404,
      })
    }
  } catch (error) {
    console.error('Error deleting vendor:', error.message)
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    })
  }
}
