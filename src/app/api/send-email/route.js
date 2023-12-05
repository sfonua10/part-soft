import AWS from 'aws-sdk'
import WorkOrder from '@/models/workOrder'

// Configure AWS SES
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2', // Replace with your AWS SES region
})

const ses = new AWS.SES({ apiVersion: '2010-12-01' })

export async function POST(request) {
  try {
    console.log('Starting POST request processing for email...')

    // Parse the request JSON body
    const { vendorData, organizationName } = await request.json()
    const { _id, workOrderNumber, vehicle, parts, vendors } = vendorData
    // Function to generate email content
    const emailMessageTemplate = (vendor) => {
      const domain = 'https://part-soft.vercel.app'
    //   const domain = 'http://localhost:3000'
      const basePath = `${domain}/form`
      const encodedPartName = encodeURIComponent(parts.partName)
      const encodedPartNumber = encodeURIComponent(parts.partNumber)
      const encodedOrganizationName = encodeURIComponent(organizationName)
      const encodedVendorName = encodeURIComponent(vendor.name)
      const queryString = `?vendorName=${encodedVendorName}&organizationName=${encodedOrganizationName}&partName=${encodedPartName}&partNumber=${encodedPartNumber}&partId=${parts._id}&workOrderNumber=${workOrderNumber}`
      const formLink = `${basePath}${queryString}`

      return `
          <div style="background-color: #f0f0f0; padding: 20px; display: flex; justify-content: center; align-items: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); max-width: 600px; width: 100%; margin: auto; text-align: left;">
              <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 20px;">
                Part Request from ${organizationName}
              </h1>
              <p style="color: #333333; margin-bottom: 20px; font-size: 18px;">
                Hi ${vendor.name},
              </p>
              <p style="color: #333333; margin-bottom: 20px; font-size: 18px;">
                We're requesting availability and pricing for a part related to:
                <br>Work Order: ${workOrderNumber}
                <br>Make: ${vehicle.make}
                <br>Model: ${vehicle.model}
                <br>Year: ${vehicle.year}
                <br>VIN: ${vehicle.vin}
                <br>Part Name: ${parts.partName}
                <br>Part Number: ${parts.partNumber}
              </p>
              <a href="${formLink}" target="_blank" style="display: block; text-align: center; background-color: #2563EB; color: #ffffff; padding: 14px 20px; border-radius: 8px; text-decoration: none; margin-bottom: 20px; font-weight: bold; font-size: 16px; margin: 0 auto; max-width: 200px;">
                Click here to submit your response
              </a>
              <p style="color: #333333; font-size: 16px;">
                Thanks,<br>${organizationName}
              </p>
            </div>
          </div>
        `
    }
    const prepareVendorResponse = (vendorName) => {
      return {
        vendorName: vendorName,
        availability: 'Pending',
        orderStatus: 'N/A',
        price: null,
        delivery: null,
        partAvailable: 'N/A',
      }
    }

    let vendorResponsesToUpdate = []

    // Send email to each vendor
    for (const vendor of vendors) {
      if (!vendor.email) {
        console.warn(`Missing email for vendor: ${vendor.name}`)
        continue
      }

      const personalizedEmailContent = emailMessageTemplate(vendor)

      const emailParams = {
        Source: process.env.EMAIL_FROM,
        Destination: {
          ToAddresses: [vendor.email],
        },
        Message: {
          Subject: {
            Data: 'Part Request Information',
          },
          Body: {
            Html: {
              Data: personalizedEmailContent,
            },
          },
        },
      }

      // Send the email
      await ses.sendEmail(emailParams).promise()
      console.log(`Email sent successfully to ${vendor.email}.`)
      vendorResponsesToUpdate.push(prepareVendorResponse(vendor.name))
    }
    try {
      for (const response of vendorResponsesToUpdate) {
        await WorkOrder.updateOne(
          { _id: _id, 'parts._id': parts._id },
          {
            $push: { 'parts.$.vendorResponses': response },
            $set: { 'parts.$.notificationsSent': new Date() },
          },
        )
      }
      console.log('Updated notificationsSent and vendorResponses for the part.')
    } catch (dbError) {
      console.error(
        'Error updating notificationsSent and vendorResponses for part:',
        parts._id,
        dbError.message,
      )
      throw new Error(dbError.message)
    }

    return new Response(
      JSON.stringify({ message: 'Emails sent and responses updated' }),
      {
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error encountered in email sending:', error.message)
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    })
  }
}
