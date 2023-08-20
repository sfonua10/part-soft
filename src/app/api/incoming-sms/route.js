import twilio from 'twilio'
// import mongoose from "mongoose";
import Vendor from '@/models/vendor'

export async function POST(request) {
  const formData = new URLSearchParams(await request.text())
  const senderNumber = request.headers.get('From') || formData.get('From')
  const numbersString = process.env.NUMBERS_TO_SEND_TO
  const pairs = numbersString.split(',')
  const vendorsAndNumbers = pairs.map((pair) => {
    const [name, number] = pair.split(':')
    return { name, number }
  })

  const vendorName = vendorsAndNumbers.find(
    (v) => v.number === senderNumber,
  )?.name

  // Extracting the 'Body' value from the form data
  const messageBody = formData.get('Body')

  const twiml = new twilio.twiml.MessagingResponse()

  let partAvailable
  switch (messageBody) {
    case '1':
      twiml.message(
        "Thank you for confirming availability. We'll reach out soon for further details and to discuss the purchase.",
      )
      partAvailable = 'Available'
      break

    case '2':
      twiml.message(
        "Thank you for letting us know. We'll explore other options. If you come across this part in the future, please keep us informed.",
      )
      partAvailable = 'Not Available'
      break
    case '3':
      twiml.message(
        "Thank you for the update. We've marked the part as pending and will wait for your confirmation. If you have more details in the future, please keep us informed.",
      )
      partAvailable = 'Pending'
      break
    default:
      twiml.message(
        "We didn't recognize your response. Please reply with '1' for YES or '2' for NO. Thank you!",
      )
      break
  }
  // Save to MongoDB
  if (partAvailable !== undefined && vendorName) {
    const vendor = new Vendor({
      name: vendorName,
      partAvailable: partAvailable,
      price: '$49.99',
      orderStatus: 'Delivered',
    })
    await vendor.save()
  }
  return new Response(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
    status: 200,
  })
}
