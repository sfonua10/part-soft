import { connectToDB } from '@/utils/database'
import WorkOrder from '@/models/workOrder'
import mongoose from 'mongoose';

export async function POST(req) {
  const { organizationId, workOrderNumber, vehicle, parts, mechanicName } = await req.json()
  if (organizationId && !mongoose.Types.ObjectId.isValid(organizationId)) {
    return new Response('Invalid organizationId provided', {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  try {
    await connectToDB()

    const newWorkOrder = new WorkOrder({
      organizationId,
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
