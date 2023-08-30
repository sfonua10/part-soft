import twilio from 'twilio';
import WorkOrder from '@/models/workOrder';
import Vendor from '@/models/vendor';

export async function POST(request) {
  const formData = new URLSearchParams(await request.text());
  const senderNumber = formData.get('From');
  const messageBody = formData.get('Body');

  console.log(`Received message from: ${senderNumber}, message: ${messageBody}`);

  const [identifier, partLetter, availabilityResponse, ...priceParts] = messageBody.trim().split(' ');

  const workOrder = await WorkOrder.findOne({ identifier: new RegExp('^' + identifier + '$', 'i') }); // Case-insensitive search

  if (!workOrder) {
    return replyWithError("Invalid identifier. Please check and try again.");
  }

  const vendorInfo = await Vendor.findOne({ phone: senderNumber });
  const vendorName = vendorInfo ? vendorInfo.name : 'Unknown Vendor';

  let price;
  if (priceParts.length) {
    const priceString = priceParts.join('');
    price = parseFloat(priceString.replace("$", ""));
    if (isNaN(price)) {
      return replyWithError("Invalid price format. Please reply with the format 'Identifier PartLetter YES/NO $Price'. Thank you!");
    }
  } else {
    price = null;
  }

  const normalizedPartLetter = partLetter.toUpperCase();
  const part = workOrder.parts[normalizedPartLetter.charCodeAt(0) - 65];

  if (!part) {
    return replyWithError(`No part found for letter ${normalizedPartLetter}. Please ensure the part letter is correct.`);
  }
  
  const partNumber = part.partNumber;

  let availability, orderStatus;
  switch (availabilityResponse.toUpperCase()) {
    case 'YES':
      availability = 'In Stock';
      orderStatus = 'Confirmed';
      break;
    case 'NO':
      availability = 'Out of Stock';
      orderStatus = 'N/A';
      break;
    default:
      return replyWithError("We didn't recognize your response. Please reply with the format 'Identifier PartLetter YES/NO $Price'. Thank you!");
  }

  const vendorResponseData = {
    vendorName: vendorName,
    availability: availability,
    orderStatus: orderStatus,
    partAvailable: availabilityResponse.toLowerCase(),
    price: price
  };

  const updatedWorkOrder = await WorkOrder.findOneAndUpdate(
    {
      identifier: identifier,
      'parts.partNumber': partNumber
    },
    { $push: { 'parts.$.vendorResponses': vendorResponseData } },
    { new: true }
  );

  let responseMessage;
  if (updatedWorkOrder) {
    responseMessage = `Successfully updated part ${normalizedPartLetter} with availability: ${availability} and price: $${price}.`;
  } else {
    responseMessage = `Error updating part ${normalizedPartLetter}. Please ensure the identifier and part letter are correct.`;
  }

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(responseMessage);
  return new Response(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
    status: 200,
  });
}

// Helper function to reply with an error
function replyWithError(message) {
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(message);
  return new Response(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' },
    status: 200,
  });
}
