import twilio from 'twilio';
import WorkOrder from '@/models/workOrder';

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

    let partDescriptions, responseExample;
    if (parts.length === 1) {
      partDescriptions = `Part Name: ${parts[0].partName}
Part Number: ${parts[0].partNumber}
-----------`;
      responseExample = `Yes $120`;
    } else {
      partDescriptions = parts
        .map((part, index) => `${String.fromCharCode(65 + index)}. 
    Part Name: ${part.partName}
    Part Number: ${part.partNumber}`)
        .join('\n') + "\n-----------";
      responseExample = `A Yes $120`;
    }
    
    const messageTemplate = (vendorName) => `
Hi ${vendorName},

We're requesting availability and pricing for parts related to:

Work Order: ${workOrderNumber}
Make: ${vehicle.make}
Model: ${vehicle.model}
Year: ${vehicle.year}
VIN: ${vehicle.vin}

${partDescriptions}


Example Reply: "${responseExample}".

Thanks,
United Diesel - Casey Johnson      
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
      vehicle,
      parts: parts.map((part) => ({
        ...part,
        vendorResponses,
      })),
    });

    await workOrder.save();

    for (let vendor of activeVendors) {
      console.log('Sending message to', vendor.name, 'at', vendor.phone);
      const personalizedMessage = messageTemplate(vendor.name);
      await client.messages.create({
        body: personalizedMessage,
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
