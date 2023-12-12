import { connectToDB } from '@/utils/database'
import WorkOrder from '@/models/workOrder'
import mongoose from 'mongoose'
import User from '@/models/user'

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const workOrderId = url.searchParams.get('workOrderId')

    if (!userId) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Fetch the user's details to get the organizationId
    const user = await User.findById(userId).catch((err) => {
      console.error('Error fetching user:', err.message)
      throw new Error('Error fetching user')
    })

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (workOrderId) {
      // Fetch the specific work order within the user's organization
      const workOrder = await WorkOrder.findOne({
        workOrderNumber: workOrderId,
        organizationId: user.organizationId,
      }).catch((err) => {
        console.error('Error fetching work order:', err.message)
        throw new Error('Error fetching work order')
      })

      if (!workOrder) {
        return new Response(
          JSON.stringify({ message: 'Work order not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      return new Response(JSON.stringify(workOrder), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      // Fetch all work orders within the user's organization
      const workOrders = await WorkOrder.find({
        organizationId: user.organizationId,
      })
      return new Response(JSON.stringify(workOrders), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    console.error('Error fetching work orders:', error.message)
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(req) {
  const { organizationId, workOrderNumber, vehicle, parts, mechanicName } =
    await req.json()
  if (organizationId && !mongoose.Types.ObjectId.isValid(organizationId)) {
    return new Response('Invalid organizationId provided', {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    await connectToDB()

    const newWorkOrder = new WorkOrder({
      organizationId,
      workOrderNumber,
      vehicle,
      parts,
      mechanicName,
    })

    await newWorkOrder.save()

    return new Response(JSON.stringify(newWorkOrder), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error creating new work order:', error)
    return new Response('Failed to create new work order', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

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

export async function DELETE() {
  try {
    const result = await WorkOrder.deleteMany({}) // {} will match all documents in the collection

    if (result.deletedCount > 0) {
      return new Response(
        JSON.stringify({
          message: `${result.deletedCount} work orders deleted successfully.`,
        }),
        { status: 200 },
      )
    } else {
      return new Response(
        JSON.stringify({ message: 'No work orders found to delete.' }),
        {
          status: 404,
        },
      )
    }
  } catch (error) {
    console.error('Error deleting work orders:', error.message)
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    })
  }
}
