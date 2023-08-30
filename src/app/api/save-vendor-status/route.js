import { connectToDB } from '@/utils/database'
import Vendor from '@/models/vendor' // Assuming you have a Vendor model similar to the User model

export async function POST(req, res) {
  const changedVendors = await req.json()

  try {
    await connectToDB()

    // Loop through each vendor and update their status
    for (const vendor of changedVendors) {
      await Vendor.findByIdAndUpdate(vendor._id, { isActive: vendor.isActive })
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Vendor statuses updated successfully.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error updating vendor statuses:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'An error occurred.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
