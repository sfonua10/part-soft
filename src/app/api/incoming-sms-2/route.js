import twilio from 'twilio';
import PartRequest from '@/models/partRequest';
import Vendor from '@/models/vendor';

export async function POST(request) {
  // Get the sender's phone number and the message body from the POST request
  const formData = new URLSearchParams(await request.text());
  const senderNumber = request.headers.get('From') || formData.get('From');
  const messageBody = formData.get('Body');
  console.log(`Received message from: ${senderNumber}, message: ${messageBody}`);

  // Use the sender's phone number to look up the vendor's name in the Vendor model
  const vendorInfo = await Vendor.findOne({ phone: senderNumber });
  const vendorName = vendorInfo ? vendorInfo.name : null;
  console.log(`Vendor found in DB: ${vendorName}`);

  const [workOrderNumber, response] = (messageBody || "").split(':');
  let availability, partAvailable, responseMessage;

  switch (response) {
    case '1':
      responseMessage = "Thank you for confirming availability. We'll reach out soon for further details and to discuss the purchase.";
      availability = 'In Stock';
      partAvailable = 'yes';
      break;
    case '2':
      responseMessage = "Thank you for letting us know. We'll explore other options. If you come across this part in the future, please keep us informed.";
      availability = 'Out of Stock';
      partAvailable = 'no';
      break;
    default:
      responseMessage = "We didn't recognize your response. Please reply with '1' for YES or '2' for NO. Thank you!";
      break;
  }

  const vendorResponseData = {
    vendorName: vendorName,
    availability: availability,
    partAvailable: partAvailable,
    // ... any other required fields you need to set
  };

  console.log(`Trying to find partRequest with workOrderNumber: ${workOrderNumber}`);
  
  // Find the corresponding PartRequest using the workOrderNumber and update it
  const updatedPartRequest = await PartRequest.findOneAndUpdate(
    { workOrderNumber: workOrderNumber },
    { $push: { vendorResponses: vendorResponseData } },
    { new: true, upsert: true }
  );

  if (updatedPartRequest) {
    console.log('Found and updated matching partRequest.');
  } else {
    console.log('No matching partRequest found.');
  }

  // Send a response back to the vendor using Twilio's API
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(responseMessage);
  return new Response(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
    status: 200,
  });
}
