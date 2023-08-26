import twilio from 'twilio'
import WorkOrder from '@/models/workOrder'

export async function POST(request) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.FROM_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Missing required environment variables')
    }

    const client = twilio(accountSid, authToken)
    const { workOrderNumber, parts, vendors } = await request.json()

    let partMessages = parts
      .map((part) => {
        return `
Part Name: ${part.partName}
Make: ${part.make}
Model: ${part.model}
VIN: ${part.vin}
Part Number: ${part.partNumber}
------------
`
      })
      .join('')

    const message = `
Hi,

Work Order Number: ${workOrderNumber}
${partMessages}

Do you have these in stock? Please respond with 1 if you do, and 2 if you don't.

Thank you!
Partsoft - Casey Johnson
`

    const activeVendors = vendors?.filter((vendor) => vendor.isActive)
    let vendorResponses = activeVendors.map((vendor) => ({
      _id: vendor.id,
      vendorName: vendor.name,
      availability: 'Pending',
      orderStatus: 'Pending',
      partAvailable: 'N/A',
    }))

    const workOrder = new WorkOrder({
      workOrderNumber,
      parts: parts.map((part) => ({
        ...part,
        vendorResponses,
      })),
    })

    // Save the WorkOrder to the database
    await workOrder.save()

    for (let vendor of activeVendors) {
      console.log('Sending message to', vendor.name, 'at', vendor.phone)
      await client.messages.create({
        body: message,
        from: fromNumber,
        to: vendor.phone.trim(),
      })
    }

    return new Response(JSON.stringify({ message: 'Messages sent' }), {
      status: 200,
    })
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    })
  }
}
