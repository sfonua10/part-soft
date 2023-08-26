import twilio from 'twilio'
import WorkOrder from '@/models/workOrder'
import Vendor from '@/models/vendor'

export async function POST(request) {
  const formData = new URLSearchParams(await request.text())
  const senderNumber = formData.get('From')
  const messageBody = formData.get('Body')

  console.log(`Received message from: ${senderNumber}, message: ${messageBody}`)

  const vendorInfo = await Vendor.findOne({ phone: senderNumber })
  const vendorName = vendorInfo ? vendorInfo.name : 'Unknown Vendor'

  const responses = messageBody.split(',').map((r) => r.trim())

  let responseMessage = 'Processed parts: '

  for (let response of responses) {
    const [partNumber, availability] = response.split(':').map((e) => e.trim())

    if (['yes', 'no'].includes(availability.toLowerCase())) {
      const orderStatus =
        availability.toLowerCase() === 'yes' ? 'Confirmed' : 'N/A'

      const vendorResponseData = {
        vendorName: vendorName,
        availability:
          availability.toLowerCase() === 'yes' ? 'In Stock' : 'Out of Stock',
        orderStatus: orderStatus,
        partAvailable: availability.toLowerCase(),
      }

      const updatedWorkOrder = await WorkOrder.findOneAndUpdate(
        { 'parts.partNumber': partNumber },
        { $push: { 'parts.$.vendorResponses': vendorResponseData } },
        { new: true },
      )

      if (updatedWorkOrder) {
        responseMessage += `${partNumber}:${availability}, `
      } else {
        responseMessage += `Error updating ${partNumber}, `
      }
    } else {
      responseMessage += `Invalid format for part ${partNumber}, `
    }
  }

  responseMessage = responseMessage.slice(0, -2) + '.' // Remove the trailing comma and space

  const twiml = new twilio.twiml.MessagingResponse()
  twiml.message(responseMessage)
  return new Response(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
    status: 200,
  })
}
