import twilio from 'twilio';
import WorkOrder from '@/models/workOrder';
import { customAlphabet } from 'nanoid';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'; // 26 characters
const nanoid = customAlphabet(alphabet, 4);

export async function POST(request) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.FROM_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Missing required environment variables');
    }

    const client = twilio(accountSid, authToken);
    const { workOrderNumber, vehicle, parts, vendors } = await request.json();

    // Generate a unique identifier for this Work Order
    const uniqueIdentifier = nanoid();

    let partMessages = parts
      .map((part, index) => {
        return `
${String.fromCharCode(65 + index)}. Part Name: ${part.partName}
   Part Number: ${part.partNumber}
`;
      })
      .join('');

      const message = `
      Hi,
      
      Work Order Number: ${workOrderNumber}
      Identifier: ${uniqueIdentifier}  <-- You MUST include this in your response!
      Make: ${vehicle.make}
      Model: ${vehicle.model}
      VIN: ${vehicle.vin}
      ${partMessages}
      
      To reply, use the format: 
      Identifier, Part Letter, YES/NO, Price (if available)
      Example: "${uniqueIdentifier} A YES $120".
      
      Thank you!
      Partsoft - Casey Johnson
      `;
      
      
    const activeVendors = vendors?.filter((vendor) => vendor.isActive);
    let vendorResponses = activeVendors.map((vendor) => ({
      _id: vendor.id,
      vendorName: vendor.name,
      availability: 'Pending',
      orderStatus: 'Pending',
      partAvailable: 'N/A',
      price: null
    }));

    const workOrder = new WorkOrder({
      workOrderNumber,
      identifier: uniqueIdentifier,  // Store the unique identifier in the Work Order
      vehicle,
      parts: parts.map((part) => ({
        ...part,
        vendorResponses,
      })),
    });

    await workOrder.save();

    for (let vendor of activeVendors) {
      console.log('Sending message to', vendor.name, 'at', vendor.phone);
      await client.messages.create({
        body: message,
        from: fromNumber,
        to: vendor.phone.trim(),
      });
    }

    return new Response(JSON.stringify({ message: 'Messages sent' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
