import twilio from 'twilio'
import WorkOrder from '@/models/workOrder'
// import { generateUniqueCode } from '@/utils/generateUniqueCode'

export async function POST(request) {
  try {
    console.log('Starting POST request processing...')

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.FROM_NUMBER
    const formUrl =
      'https://867f-2601-681-5902-7c0-8509-74cb-4d14-45e.ngrok-free.app/form'

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Missing required environment variables')
    }

    const client = twilio(accountSid, authToken)
    const { _id, workOrderNumber, vehicle, organizationName, part, vendors } =
      await request.json()
    const { _id: partId, partName, partNumber } = part;

    console.log('Received request data:', {
      _id,
      workOrderNumber,
      vehicle,
      organizationName,
      partName: part.partName,
      vendorsLength: vendors.length,
    })

    const messageTemplate = (vendorName) => {
      const encodedPartName = encodeURIComponent(partName)
      const encodedPartNumber = encodeURIComponent(partNumber)
      const encodedOrganizationName = encodeURIComponent(organizationName)
      const encodedVendorName = encodeURIComponent(vendorName)
      
      return `
Hi ${vendorName},

We're requesting availability and pricing for a part related to:

Work Order: ${workOrderNumber}
Make: ${vehicle.make}
Model: ${vehicle.model}
Year: ${vehicle.year}
VIN: ${vehicle.vin}

Part Name: ${part.partName}
Part Number: ${part.partNumber}

Please click the link below to submit your response:
${formUrl}?vendorName=${encodedVendorName}&organizationName=${encodedOrganizationName}&partName=${encodedPartName}&partNumber=${encodedPartNumber}&partId=${partId}&workOrderNumber=${workOrderNumber}

Thanks,

Kacey Johnson
${organizationName}
  `
    }

    function prepareVendorResponse(vendorName) {
      return {
        vendorName: vendorName,
        availability: 'Pending',
        orderStatus: 'N/A',
        price: null,
        delivery: null,
        partAvailable: 'N/A'
      }
    }

    let vendorResponsesToUpdate = []

    for (let vendor of vendors) {
      if (!vendor.name || !vendor.phone) {
        console.warn('Vendor missing name or phone:', vendor)
        continue
      }
      // This part has the potential to be slow if there are many vendors since it waits for DB
      // operations in a loop. Depending on your application needs and the number of vendors,
      // this may or may not be an issue.

      const personalizedMessage = messageTemplate(vendor.name)
      await client.messages.create({
        body: personalizedMessage,
        from: fromNumber,
        to: vendor.phone.trim(),
      })

      vendorResponsesToUpdate.push(
        prepareVendorResponse(vendor.name),
      )
    }
    try {
      for (const response of vendorResponsesToUpdate) {
        await WorkOrder.updateOne(
          { _id: _id, 'parts._id': part._id },
          {
            $push: { 'parts.$.vendorResponses': response },
            $set: { 'parts.$.notificationsSent': new Date() },
          },
        )
      }
    } catch (dbError) {
      console.error(
        'Error updating notificationsSent and vendorResponses for part:',
        part._id,
        dbError.message,
      )
      return new Response(JSON.stringify({ message: dbError.message }), {
        status: 500,
      })
    }

    console.log('Updated notificationsSent and vendorResponses for the part.')

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
