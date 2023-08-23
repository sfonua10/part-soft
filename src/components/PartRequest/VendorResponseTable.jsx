import React from 'react'

const getPartAvailabilityStyles = (availability) => {
  switch (availability) {
    case 'In Stock':
      return {
        background: 'bg-green-50',
        text: 'text-green-700',
        ring: 'ring-green-600/20',
      }
    case 'Out of Stock':
      return {
        background: 'bg-red-50',
        text: 'text-red-700',
        ring: 'ring-red-600/20',
      }
    case 'Pending':
      return {
        background: 'bg-orange-50',
        text: 'text-orange-700',
        ring: 'ring-orange-600/20',
      }
    default:
      return {} // Default styles, if any
  }
}

const VendorResponseTable = ({ vendorResponses }) => {
  return (
    <div>
      {/* <h1 className="text-base font-semibold leading-6 text-gray-900 mb-4">Vendor Responses</h1> */}
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
                  Vendor Name
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
                  Order Status
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
                  Availability
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
                  Price ($)
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
                  Delivery Time
                </th>
                <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
                  Part Available
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendorResponses.map((response) => {
                const styles = getPartAvailabilityStyles(response.availability)

                return (
                  <tr key={response._id}>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      {response.vendorName}
                    </td>
                    {/* <td className={`px-3 py-4 text-sm ${styles.text} ${styles.background} ${styles.ring}`}>
                                            {response.availability}
                                        </td> */}
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {response.orderStatus}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${styles.text} ${styles.background} ${styles.ring}`}
                      >
                        {response.availability}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {response.price}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {response.delivery}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {response.partAvailable}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VendorResponseTable
