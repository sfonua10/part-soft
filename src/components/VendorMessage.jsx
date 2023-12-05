import React from 'react'

const VendorMessage = ({
  workOrderNumber,
  vehicle,
  selectedPart,
  vendorData,
  organizationName
}) => {
  const vendorNames = selectedPart?.selectedVendors?.map((vendorId) => {
    const vendor = vendorData.find((v) => v._id === vendorId)
    return vendor?.name || 'N/A'
  })

  const generateMessage = () => {
    const vendorsList = vendorNames?.join(', ')

    const partDescriptions = `
  Part Name: ${selectedPart.partName}
  Part Number: ${selectedPart.partNumber}
  `
    return `
  Hi ${vendorsList},
  
  We're requesting availability and pricing for a part related to:
  
  Work Order: ${workOrderNumber}
  Make: ${vehicle.make}
  Model: ${vehicle.model}
  Year: ${vehicle.year}
  VIN: ${vehicle.vin}
  ${partDescriptions}
  Please click the link below to submit your response:
  [URL link will be inserted here]

  Thanks,

  Kacey Johnson
  ${organizationName}
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
      <div className="whitespace-pre-line text-sm text-gray-600">
        {generateMessage()}
      </div>
    </section>
  )
}

export default VendorMessage
