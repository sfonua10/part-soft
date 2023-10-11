import { connectToDB } from '@/utils/database'
import WorkOrder from '@/models/workOrder'  // Assuming you have a WorkOrder model

export async function PUT(req, res) {
  const updatedWorkOrder = await req.json()

  try {
    await connectToDB()

    const workOrder = await WorkOrder.findByIdAndUpdate(
      updatedWorkOrder._id, 
      {
        'vehicle.vin': updatedWorkOrder.vehicle.vin,
        'vehicle.make': updatedWorkOrder.vehicle.make,
        'vehicle.model': updatedWorkOrder.vehicle.model,
        'vehicle.year': updatedWorkOrder.vehicle.year,
        'status': updatedWorkOrder.status
      }, 
      { new: true }  // This option returns the modified document
    );

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
        message: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
