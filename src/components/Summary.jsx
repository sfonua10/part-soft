import React from 'react'

const Summary = ({
  workOrderNumber,
  vehicle,
  selectedPart = {},
  vendorData,
}) => {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  
  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
        Parts summary
      </h2>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900">Work Order #</h3>
        <p className="text-sm text-gray-600">
          {workOrderNumber || 'Not provided'}
        </p>
      </div>

      {/* Additional Vehicle Info */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900">
          Vehicle Information
        </h3>
        <dl className="mt-2 space-y-2">
          {['vin', 'make', 'model', 'year'].map((field, index) => (
            <div key={index} className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">
                {capitalizeFirstLetter(field)}
              </dt>
              <dd className="text-sm font-medium text-gray-900">
                {vehicle[field] || 'N/A'}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {selectedPart.partName && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900">Selected Part</h3>
          <dl className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Part Name</dt>
              <dd className="text-sm font-medium text-gray-900">
                {selectedPart.partName || 'N/A'}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Part Num.</dt>
              <dd className="text-sm font-medium text-gray-900">
                {selectedPart.partNumber || 'N/A'}
              </dd>
            </div>
            {/* If you want to display additional details from selectedPart, you can add more divs here. */}
          </dl>
        </div>
      )}

      {selectedPart?.selectedVendors &&
        selectedPart.selectedVendors.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">
              Selected Vendors
            </h3>
            <dl className="mt-2 space-y-2">
              {selectedPart.selectedVendors.map((vendorId, index) => {
                const vendor = vendorData.find((v) => v._id === vendorId)
                if (vendor) {
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <dt className="text-sm text-gray-600">Vendor Name</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {vendor.name || 'N/A'}
                      </dd>
                    </div>
                  )
                }
                return null
              })}
            </dl>
          </div>
        )}

      {/* <div className="mt-6">
        <button
          type="submit"
          disabled={isQueueButtonDisabled}
          className={`w-full rounded-md border border-transparent px-4 py-3 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isQueueButtonDisabled
              ? 'cursor-not-allowed bg-gray-300 text-gray-500'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-gray-50'
          }`}
        >
          Queue
        </button>
      </div> */}
    </section>
  )
}

export default Summary
