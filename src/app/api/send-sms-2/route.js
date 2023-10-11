import twilio from 'twilio'

export async function POST(request) {
  try {
    console.log('Starting POST request processing...')

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.FROM_NUMBER

    console.log('Environment variables:', {
      accountSid: !!accountSid,
      authToken: !!authToken,
      fromNumber: fromNumber,
    })

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Missing required environment variables')
    }

    const client = twilio(accountSid, authToken)
    const { workOrderNumber, vehicle, parts, vendors } = await request.json()

    console.log('Received request data:', {
      workOrderNumber,
      vehicle,
      partsLength: parts.length,
      vendorsLength: vendors.length,
    })

    let partDescriptions, responseExamples;
if (parts.length === 1) {
    partDescriptions = `Part Name: ${parts[0].partName}
Part Number: ${parts[0].partNumber}
-----------`;
    responseExamples = `Yes 124.99`;
} else {
    partDescriptions = parts
        .map((part, index) => `${String.fromCharCode(65 + index)}. 
    Part Name: ${part.partName}
    Part Number: ${part.partNumber}`)
        .join('\n') + "\n-----------";

    // Generate response example for multiple parts
    responseExamples = parts
        .map((part, index) => {
            const letter = String.fromCharCode(65 + index);
            // Here we'll alternate between Yes with a price and No without a price for the example.
            const response = (index % 2 === 0) ? `Yes ${120 + index}` : 'No';
            return `${letter} ${response}`;
        })
        .join(', ');
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


Example Reply: "${responseExamples}".

Thanks,
Partsoft - Casey Johnson      
    `

    for (let vendor of vendors) {
      if (!vendor.data.name || !vendor.data.phone) {
        console.warn('Vendor missing name or phone:', vendor)
        continue // skip this iteration and go to the next vendor
      }

      console.log('Preparing message for', vendor.data.name, 'at', vendor.data.phone)
      const personalizedMessage = messageTemplate(vendor.data.name)
      console.log('Sending message:', personalizedMessage)
      await client.messages.create({
        body: personalizedMessage,
        from: fromNumber,
        to: vendor.data.phone.trim(),
      })
    }

    console.log('Messages sent successfully.')
    return new Response(JSON.stringify({ message: 'Messages sent' }), {
      status: 200,
    })
  } catch (error) {
    console.error('Error encountered:', error.message)
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    })
  }
}
