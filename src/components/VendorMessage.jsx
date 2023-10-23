import React from 'react'

const VendorMessage = ({ workOrderNumber, vehicle, selectedPart, vendorData }) => {

  const vendorNames = selectedPart?.selectedVendors?.map((vendorId) => {
    const vendor = vendorData.find((v) => v._id === vendorId)
    return vendor?.name || 'N/A'
  })

  const generateMessage = () => {
    const partDescriptions = `
  Part Name: ${selectedPart.partName}
  Part Number: ${selectedPart.partNumber}
  -----------`

    const responseExamples = `Yes 124.99` // since it's just one part

    return `
  Hi [Vendor],
  
  We're requesting availability and pricing for the following part related to:
  
  Work Order: ${workOrderNumber}
  Make: ${vehicle.make}
  Model: ${vehicle.model}
  Year: ${vehicle.year}
  VIN: ${vehicle.vin}
  
  ${partDescriptions}
  
  Example Reply: "${responseExamples}".
  
  Thanks,
  Partsoft - Kacey Johnson
  `
  }

  return (
    <section
      aria-labelledby="message-heading"
      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:mt-0 lg:p-8"
    >
      <h2 id="message-heading" className="text-lg font-medium text-gray-900">
        Vendor Messages
      </h2>

      {vendorNames && vendorNames.length > 0 && (
        <ul className="mt-2 space-y-2">
          {vendorNames.map((index) => (
            <li
              key={index}
              className="whitespace-pre-line text-sm text-gray-600"
            >
              {generateMessage()}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default VendorMessage
