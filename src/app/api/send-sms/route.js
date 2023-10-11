import twilio from 'twilio';
import WorkOrder from '@/models/workOrder';
import { customAlphabet } from 'nanoid';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'; // 26 characters
const nanoid = customAlphabet(alphabet, 4);

export async function POST(request) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.FROM_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Missing required environment variables');
    }

    const client = twilio(accountSid, authToken);
    const { workOrderNumber, vehicle, parts, vendors } = await request.json();

    // Generate a unique identifier for this Work Order
    const uniqueIdentifier = nanoid();
    // const shortIdentifier = workOrderNumber[0] + workOrderNumber.slice(-3); // Example: "W345"

    let partDescriptions, responseExample;
    if (parts.length === 1) {
      partDescriptions = `Part Name: ${parts[0].partName}
Part Number: ${parts[0].partNumber}
-----------`;
      responseExample = `${uniqueIdentifier} YES $120`;
    } else {
      partDescriptions = parts
        .map((part, index) => `${String.fromCharCode(65 + index)}. 
    Part Name: ${part.partName}
    Part Number: ${part.partNumber}`)
        .join('\n') + "\n-----------";
      responseExample = `${uniqueIdentifier} A YES $120`;
    }
    
    const messageTemplate = (vendorName) => `
Hi ${vendorName},

We're requesting availability and pricing for parts related to:

Work Order: ${workOrderNumber}
Make: ${vehicle.make}
Model: ${vehicle.model}
Year: ${vehicle.year}
VIN: ${vehicle.vin}

${partDescriptions}


Example Reply: "${responseExample}".

Thanks,
Partsoft - Casey Johnson      
    `;

    let vendorResponses = vendors.map((vendor) => ({
      _id: vendor.id,
      vendorName: vendor.name,
      availability: 'Pending',
      orderStatus: 'Pending',
      partAvailable: 'N/A',
      price: null
    }));

    const workOrder = new WorkOrder({
      workOrderNumber,
      identifier: uniqueIdentifier,  // Store the unique identifier in the Work Order
      vehicle,
      parts: parts.map((part) => ({
        ...part,
        vendorResponses,
      })),
    });

    await workOrder.save();

    for (let vendor of vendors) {
      console.log('Sending message to', vendor.name, 'at', vendor.phone);
      const personalizedMessage = messageTemplate(vendor.name);
      await client.messages.create({
        body: personalizedMessage,
        from: fromNumber,
        to: vendor.phone.trim(),
      });
    }

    return new Response(JSON.stringify({ message: 'Messages sent' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
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
