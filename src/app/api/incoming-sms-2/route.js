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

export async function POST(request) {
    const formData = new URLSearchParams(await request.text());
    const senderNumber = formData.get('From');
    const messageBody = formData.get('Body');

    console.log(`Received message from: ${senderNumber}, message: ${messageBody}`);

    const { code, availability: extractedAvailability, price: extractedPrice } = extractAvailabilityAndPrice(messageBody);

    // Instead of fetching the last work order and inferring part based on code, 
    // we'll now find the work order and part based on the received code.
    const workOrder = await WorkOrder.findOne({ "parts.vendorResponses.code": code });
    if (!workOrder) {
        return replyWithError("Couldn't find a matching work order based on your response. Please check and try again.");
    }

    const part = workOrder.parts.find(p => p.vendorResponses.some(vr => vr.code === code));

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
        price: extractedPrice,
        code: code
    };

    const vendorResponseIndex = part.vendorResponses.findIndex(response => response.vendorName === vendorName && response.code === code);

    let updatedWorkOrder;

    if (vendorResponseIndex !== -1) {
        const updateKey = `parts.$[partElement].vendorResponses.${vendorResponseIndex}`;
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
            { arrayFilters: [{ 'partElement._id': part._id }], new: true }
        );
    } else {
        const pushData = { [`parts.$[partElement].vendorResponses`]: vendorResponseData };
        if (extractedPrice === null) {
            delete pushData[`parts.$[partElement].vendorResponses`].price;
        }
        updatedWorkOrder = await WorkOrder.findOneAndUpdate(
            { _id: workOrder._id },
            { $push: pushData },
            { arrayFilters: [{ 'partElement._id': part._id }], new: true }
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
