import twilio from 'twilio'

export async function POST(request) {
  // throw new Error("This is a test error.");
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.FROM_NUMBER
    const numbersString = process.env.NUMBERS_TO_SEND_TO

    if (!accountSid || !authToken || !fromNumber || !numbersString) {
      throw new Error('Missing required environment variables')
    }
    const client = twilio(accountSid, authToken)
    const { year, make, model, vin, partNumber } = await request.json()
    const message = `
Hi,

We're looking for the following truck part:

Year: ${year}
Make: ${make}
Model: ${model}
VIN: ${vin}
Part Number: ${partNumber}

Do you have this in stock? Please respond with 1 if you do, and 2 if you don't.

Thank you!
Partsoft - Casey Johnson
        `
    // const imageUrl = "https://content.churchofjesuschrist.org/acp/bc/cp/Asia%20Area/Area/Gospel%20Topics/Baptism/1200x1920/john-baptizes-christ-39544-print.jpg";

    const pairs = numbersString.split(',')
    const vendorsAndNumbers = pairs.map((pair) => {
      const [name, number] = pair.split(':')
      return { name, number }
    })

    for (let { name, number } of vendorsAndNumbers) {
      console.log('Sending message to', name, 'at', number)
      await client.messages.create({
        body: message,
        from: fromNumber,
        to: number.trim(),
        // mediaUrl: imageUrl,
      })
    }
    return new Response(JSON.stringify({ message: 'Messages sent' }), {
      status: 200,
    })
  } catch (error) {
    console.error('Error:', error.message)
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
