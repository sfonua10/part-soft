import twilio from 'twilio';
import WorkOrder from '@/models/workOrder';
import Vendor from '@/models/vendor';

function extractAvailabilityAndPrice(str) {
  const regex = /([a-zA-Z])\s*([yY](es)?|[nN]o?)?(\d+(\.\d{0,2})?)?/;
  const match = str.match(regex);

  if (match) {
      const code = match[1];
      const availability = match[2] || (match[4] ? 'yes' : null);
      let price = parseFloat(match[4]);
      if (isNaN(price)) {
          price = null;  // setting to null if it's NaN
      }
      return { code, availability, price };
  }

  return { code: null, availability: null, price: null }; // default case
}

function getPartIndexFromCode(code) {
    return code.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
}

export async function POST(request) {
    const formData = new URLSearchParams(await request.text());
    const senderNumber = formData.get('From');
    const messageBody = formData.get('Body');

    console.log(`Received message from: ${senderNumber}, message: ${messageBody}`);

    const { code, availability: extractedAvailability, price: extractedPrice } = extractAvailabilityAndPrice(messageBody);

    const partIndex = getPartIndexFromCode(code);
    const workOrder = await WorkOrder.findOne({}).sort({ _id: -1 });

    if (!workOrder || partIndex < 0 || partIndex >= workOrder.parts.length) {
        return replyWithError("Couldn't find a matching part or work order based on your response. Please check and try again.");
    }

    const part = workOrder.parts[partIndex];

    const vendorInfo = await Vendor.findOne({ phone: senderNumber });
    const vendorName = vendorInfo ? vendorInfo.name : 'Unknown Vendor';

    let availability, orderStatus;
    const cleanedAvailabilityResponse = (extractedAvailability || '').trim().toUpperCase();

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
            if (extractedPrice !== null) {
                availability = 'In Stock';
                orderStatus = 'Confirmed';
            } else {
                return replyWithError("We didn't recognize your response. Please reply with the format 'A/B/C... $Price' for available parts or 'A/B/C... N/NO' for unavailable parts. Thank you!");
            }
    }

    const vendorResponseData = {
        vendorName: vendorName,
        availability: availability,
        orderStatus: orderStatus,
        partAvailable: cleanedAvailabilityResponse.toLowerCase(),
        price: extractedPrice
    };

    const vendorResponseIndex = part.vendorResponses.findIndex(response => response.vendorName === vendorName);

    let updatedWorkOrder;

    if (vendorResponseIndex !== -1) {
        const updateKey = `parts.${partIndex}.vendorResponses.${vendorResponseIndex}`;
        const updateData = {
            [`${updateKey}.availability`]: availability,
            [`${updateKey}.orderStatus`]: orderStatus,
            [`${updateKey}.partAvailable`]: cleanedAvailabilityResponse.toLowerCase(),
        };
        if (extractedPrice !== null) {
            updateData[`${updateKey}.price`] = extractedPrice;
        }
        updatedWorkOrder = await WorkOrder.findOneAndUpdate(
            { _id: workOrder._id },
            updateData,
            { new: true }
        );
    } else {
        const pushData = { [`parts.${partIndex}.vendorResponses`]: vendorResponseData };
        if (extractedPrice === null) {
            delete pushData[`parts.${partIndex}.vendorResponses`].price;
        }
        updatedWorkOrder = await WorkOrder.findOneAndUpdate(
            { _id: workOrder._id },
            { $push: pushData },
            { new: true }
        );
    }

    let responseMessage;
    if (updatedWorkOrder) {
        responseMessage = `Successfully updated the part with availability: ${availability} and price: $${extractedPrice}.`;
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

function replyWithError(message) {
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(message);
    return new Response(twiml.toString(), {
        headers: { 'Content-Type': 'text/xml' },
        status: 200,
    });
}
