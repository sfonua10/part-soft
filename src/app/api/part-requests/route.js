import { connectToDB } from '@/utils/database';
import PartRequest from '@/models/partRequest'; 

export async function POST(req) {
  const { workOrderNumber, vehicle, parts } = await req.json();

  try {
    await connectToDB();

    const newPartRequest = new PartRequest({
      workOrderNumber,
      vehicle,
      parts,
    });

    await newPartRequest.save();

    return new Response(JSON.stringify(newPartRequest), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error creating new part request:", error);
    return new Response('Failed to create new part request', {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
