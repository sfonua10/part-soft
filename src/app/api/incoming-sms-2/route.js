import twilio from 'twilio';
import WorkOrder from '@/models/workOrder';
import Vendor from '@/models/vendor';

function extractAvailabilityAndPrice(str) {
  const regex = /([yY](es)?|[nN]o?)(\d+(\.\d{0,2})?)?/;
  const match = str.match(regex);
  
  if (match) {
      const availability = match[1];
      const price = parseFloat(match[2]);
      return { availability, price };
  }
  
  return { availability: str, price: null }; // default case
}

export async function POST(request) {
  const formData = new URLSearchParams(await request.text());
  const senderNumber = formData.get('From');
  const messageBody = formData.get('Body');

  console.log(`Received message from: ${senderNumber}, message: ${messageBody}`);

  const [responsePart, ...priceParts] = messageBody.trim().split(' ');
  const { availability: extractedAvailability, price: extractedPrice } = extractAvailabilityAndPrice(responsePart);

  // We will assume the latest work order queried by this vendor is the one being responded to.
  const workOrder = await WorkOrder.findOne({}).sort({_id: -1});
  if (!workOrder) {
      return replyWithError("Couldn't find a matching work order. Please check and try again.");
  }
  
  const vendorInfo = await Vendor.findOne({ phone: senderNumber });
  const vendorName = vendorInfo ? vendorInfo.name : 'Unknown Vendor';

  let price;
  if (extractedPrice) {
    price = extractedPrice;
  } else if (priceParts.length) {
    const priceString = priceParts.join('').replace("$", "");
    price = parseFloat(priceString);
  } else {
    price = null;
  }

  if (isNaN(price) && price !== null) {
    return replyWithError("Invalid price format. Please reply with the format 'YES/NO $Price'. You can include the dollar sign or omit it. Thank you!");
  }
  const part = workOrder.parts[0];
  const partNumber = part.partNumber;

  let availability, orderStatus;
  const cleanedAvailabilityResponse = extractedAvailability.trim().toUpperCase();
  switch (cleanedAvailabilityResponse) {
    case 'YES':
    case 'Y':
      availability = 'In Stock';
      orderStatus = 'Confirmed';
      break;
    case 'NO':
    case 'N':
      availability = 'Out of Stock';
      orderStatus = 'N/A';
      break;
    default:
      return replyWithError("We didn't recognize your response. Please reply with the format 'YES/NO $Price'. Thank you!");
  }

  const vendorResponseData = {
    vendorName: vendorName,
    availability: availability,
    orderStatus: orderStatus,
    partAvailable: cleanedAvailabilityResponse.toLowerCase(),
    price: price
  };

  const vendorResponseIndex = part.vendorResponses.findIndex(response => response.vendorName === vendorName);

  let updatedWorkOrder;

  if (vendorResponseIndex !== -1) {
      // If the vendor response already exists, update it.
      const updateKey = `parts.$.vendorResponses.${vendorResponseIndex}`;
      updatedWorkOrder = await WorkOrder.findOneAndUpdate(
          {
              'parts.partNumber': partNumber
          },
          {
              [`${updateKey}.availability`]: availability,
              [`${updateKey}.orderStatus`]: orderStatus,
              [`${updateKey}.partAvailable`]: cleanedAvailabilityResponse.toLowerCase(),
              [`${updateKey}.price`]: price
          },
          { new: true }
      );
  } else {
      // If the vendor response doesn't exist, add a new one.
      updatedWorkOrder = await WorkOrder.findOneAndUpdate(
          {
              'parts.partNumber': partNumber
          },
          { $push: { 'parts.$.vendorResponses': vendorResponseData } },
          { new: true }
      );
  }

  let responseMessage;
  if (updatedWorkOrder) {
      responseMessage = `Successfully updated the part with availability: ${availability} and price: $${price}.`;
  } else {
      responseMessage = `Error updating the part. Please ensure you are responding to the correct request.`;
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
