import { connectToDB } from '@/utils/database'
import WorkOrder from '@/models/workOrder'
import mongoose from 'mongoose'

export async function PUT(req) {
  try {
    const { _id, vehicle, status, selectedPart, parts } = await req.json()

    await connectToDB()

    let updateQuery = {
      status: status,
    }

    if (vehicle) {
      updateQuery['vehicle.vin'] = vehicle.vin
      updateQuery['vehicle.make'] = vehicle.make
      updateQuery['vehicle.model'] = vehicle.model
      updateQuery['vehicle.year'] = vehicle.year
    }

    if (parts) {
      updateQuery['parts'] = parts
    }

    if (selectedPart && selectedPart._id) {
      updateQuery['selectedPart'] = new mongoose.Types.ObjectId(
        selectedPart._id,
      )
    }

    const workOrder = await WorkOrder.findByIdAndUpdate(_id, updateQuery, {
      new: true,
    })

    if (!workOrder) {
      throw new Error('Work order not found')
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Work order updated successfully.',
        workOrder,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error updating work order:', error.message)
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
