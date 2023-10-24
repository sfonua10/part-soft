import twilio from 'twilio'
import WorkOrder from '@/models/workOrder'

export async function POST(request) {
  try {
    console.log('Starting POST request processing...')

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.FROM_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Missing required environment variables')
    }

    const client = twilio(accountSid, authToken)
    const { _id, workOrderNumber, vehicle, part, vendors } = await request.json()

    console.log('Received request data:', {
      _id,
      workOrderNumber,
      vehicle,
      partName: part.partName,
      vendorsLength: vendors.length,
    })

    const partDescription = `
Part Name: ${part.partName}
Part Number: ${part.partNumber}
-----------`;

    const responseExample = `Yes 124.99`;

    const messageTemplate = (vendorName) => `
Hi ${vendorName},

We're requesting availability and pricing for a part related to:

Work Order: ${workOrderNumber}
Make: ${vehicle.make}
Model: ${vehicle.model}
Year: ${vehicle.year}
VIN: ${vehicle.vin}

${partDescription}

Example Reply: "${responseExample}".

Thanks,
Partsoft - Casey Johnson      
    `

    for (let vendor of vendors) {
      if (!vendor.name || !vendor.phone) {
        console.warn('Vendor missing name or phone:', vendor)
        continue
      }

      const personalizedMessage = messageTemplate(vendor.name)
      await client.messages.create({
        body: personalizedMessage,
        from: fromNumber,
        to: vendor.phone.trim(),
      })
    }

    try {
      await WorkOrder.updateOne(
        { _id: _id, 'parts._id': part._id },
        {
          $set: { 'parts.$.notificationsSent': new Date() },
        },
      )
    } catch (dbError) {
      console.error(
        'Error updating notificationsSent for part:',
        part._id,
        dbError.message,
      )
      return new Response(JSON.stringify({ message: dbError.message }), {
        status: 500,
      })
    }
    
    console.log('Updated notificationsSent for the part.')

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
