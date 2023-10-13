import { connectToDB } from '@/utils/database'
import WorkOrder from '@/models/workOrder'

export async function POST(req) {
  const { workOrderNumber, vehicle, parts, mechanicName } = await req.json()

  try {
    await connectToDB()

    const newWorkOrder = new WorkOrder({
      workOrderNumber,
      vehicle,
      parts,
      mechanicName
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
