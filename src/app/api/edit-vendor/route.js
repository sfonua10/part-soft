import { connectToDB } from '@/utils/database';
import Vendor from '@/models/vendor';

export async function PUT(req) {
  console.log('Received PUT request for Vendor update'); // Log the initial request

  try {
    // Destructure all the needed fields from the request
    const { _id, name, phone, email, primaryContact, specialization, isActive, isSaved } = await req.json();
    console.log('Parsed request body:', { _id, name, phone, email, primaryContact, specialization, isActive, isSaved });

    if (!_id) {
      console.error('Vendor ID missing in request body');
      return new Response('Vendor ID is required for update', {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (name === "ErrorTest") {
      throw new Error("This is a test error!");
    }

    await connectToDB();
    console.log('Connected to database');

    // Format the phone number to E.164 if it doesn't start with a '+'
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    const updateValues = {
      name,
      phone: formattedPhone,
      email,
      primaryContact,
      specialization,
      isActive,
      isSaved
    };
    console.log('Update values:', updateValues);

    // Find vendor by ID and update it
    const updatedVendor = await Vendor.findByIdAndUpdate(_id, updateValues, { new: true });  // { new: true } ensures that the updated document is returned
    console.log('Updated vendor:', updatedVendor);

    if (!updatedVendor) {
      console.error('Vendor with given ID not found in database:', _id);
      return new Response('Vendor not found', {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(updatedVendor), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error updating vendor:', error);
    return new Response('Failed to update vendor', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
