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
      'https://part-soft.vercel.app/form'

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Missing required environment variables')
    }

    const client = twilio(accountSid, authToken)
    const { _id, workOrderNumber, vehicle, organizationName, part, vendors } =
      await request.json()
    const { _id: partId, partName, partNumber } = part;

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

//SEt up AWS SDK
// npm i aws-sdk

//Use it in code ====>
// import twilio from "twilio";
// import AWS from 'aws-sdk';

// export async function POST(request) {
//     // AWS Configuration
//     AWS.config.update({
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//         region: process.env.AWS_REGION
//     });

//     const s3 = new AWS.S3();
//     const bucketName = "YOUR_S3_BUCKET_NAME"; // replace with your bucket name

//     const accountSid = process.env.TWILIO_ACCOUNT_SID;
//     const authToken = process.env.TWILIO_AUTH_TOKEN;
//     const client = twilio(accountSid, authToken);

//     const fromNumber = "+18444490853";

//     // Extracting the form details from the request payload
//     const { year, make, model, vin, partNumber, images } = await request.json();

//     // Composing the message from the form details
//     const message = `
//         Year: ${year}
//         Make: ${make}
//         Model: ${model}
//         VIN: ${vin}
//         Part Number: ${partNumber}
//     `;

//     const numbersToSendTo = [
//         '+18017229592',
//         // Other numbers...
//     ];

//     // Upload images to S3 and get their public URLs
//     const uploadToS3 = async (base64Image, index) => {
//         const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
//         const key = `image_${Date.now()}_${index}.png`; // unique name for every image

//         const params = {
//             Bucket: bucketName,
//             Key: key,
//             Body: buffer,
//             ContentEncoding: 'base64',
//             ContentType: 'image/png'
//         };

//         return new Promise((resolve, reject) => {
//             s3.putObject(params, (err, data) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(`https://${bucketName}.s3.amazonaws.com/${key}`);
//                 }
//             });
//         });
//     };

//     const imageUrls = await Promise.all(images.map((img, idx) => uploadToS3(img, idx)));

//     for (let toNumber of numbersToSendTo) {
//         console.log("Sending message to", toNumber);
//         await client.messages.create({
//           body: message,
//           from: fromNumber,
//           to: toNumber,
//           mediaUrl: imageUrls // Using S3 URLs
//         });
//     }

//     return new Response(JSON.stringify({ message: "Messages sent"}), {status: 200});
// }

//*****NOTE */
// This assumes your S3 bucket has a policy to allow public access to objects. If it doesn't, the images won't be accessible via a public URL. Make sure your S3 bucket's permissions are set appropriately.

// Ensure you don't expose your AWS access keys. Ideally, use environment variables or some secret management service.

// This code is not optimized for error handling and might fail if there's any issue with S3 or if any of the environment variables are missing. Make sure you handle errors gracefully in production code.