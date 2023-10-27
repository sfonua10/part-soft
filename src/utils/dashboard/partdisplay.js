export function getBackgroundColorForAvailability(availability) {
  switch (availability) {
    case 'In Stock':
      return 'bg-green-50'
    case 'Out of Stock':
      return 'bg-red-50'
    default:
      return '' // or some default color
  }
}

function formatDate(isoDateString) {
  const date = new Date(isoDateString)
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed in JavaScript
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

export function transformData(dataArray) {
  return dataArray.map((item) => {
    const rawDate =
      typeof item.dateSubmitted === 'string' && item.dateSubmitted !== 'N/A'
        ? new Date(item.dateSubmitted).toISOString()
        : null
    const dateSubmitted = rawDate ? formatDate(rawDate) : 'N/A'
    return {
      workOrderNumber: item.workOrderNumber,
      dateSubmitted: dateSubmitted,
      mechanicName: item.mechanicName || 'N/A',  // Including mechanicName in case you need it
      vehicle: {  // Vehicle data added here
        make: item.vehicle.make || 'N/A',
        model: item.vehicle.model || 'N/A',
        year: item.vehicle.year || 'N/A',
        vin: item.vehicle.vin || 'N/A',
      },
      parts: item.parts.map((part) => {
        return {
          name: `${part.partName} - ${part.partNumber}`,
          vendors: part.vendorResponses.map((vendor) => {
            let priceValue = vendor.price
            if (typeof priceValue === 'number') {
              priceValue = `$${priceValue}`
            } else if (priceValue && priceValue['$numberInt']) {
              priceValue = `$${priceValue['$numberInt']}`
            } else {
              priceValue = 'N/A'
            }
            return {
              vendorName: vendor.vendorName,
              availability: vendor.availability || 'N/A',
              orderStatus: vendor.orderStatus || 'N/A',
              price: priceValue,
            }
          }),
        }
      }),
    }
  })
}
