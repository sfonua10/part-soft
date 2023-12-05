import { connectToDB } from '@/utils/database'
import WorkOrder from '@/models/workOrder'
import mongoose from 'mongoose'

export async function POST(req) {
  const { workOrderNumber, partId, vendorName, available, price } = await req.json()

  if (
    // !mongoose.Types.ObjectId.isValid(workOrderId) ||
    !mongoose.Types.ObjectId.isValid(partId)
  ) {
    return new Response('Invalid work order ID or part ID provided', {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    await connectToDB()

    // Find the work order
    const workOrder = await WorkOrder.findOne({ workOrderNumber });
    if (!workOrder) {
      return new Response('Work order not found', {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Find the part and update the vendor response
    const part = workOrder.parts.id(partId)
    if (!part) {
      return new Response('Part not found', {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Update the vendor response
    const vendorResponse = part.vendorResponses.find(
      (v) => v.vendorName === vendorName,
    )
    if (vendorResponse) {
      vendorResponse.availability =
        available === 'yes' ? 'In Stock' : 'Out of Stock'
      vendorResponse.price = available === 'yes' ? price : null
      // Update other relevant fields in vendorResponse as needed
    } else {
      // Add new vendor response if not found
      part.vendorResponses.push({
        vendorName,
        availability: available === 'yes' ? 'In Stock' : 'Out of Stock',
        price: available === 'yes' ? price : null,
        // Set other fields as required
      })
    }

    // Save the updated work order
    await workOrder.save()

    return new Response(JSON.stringify(workOrder), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error updating work order:', error)
    return new Response('Failed to update work order', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
