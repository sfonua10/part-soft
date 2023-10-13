export default function VendorSelection({
  vendorData,
  selectedVendorIds,
  onVendorChange,
}) {
  return (
    <fieldset className="mt-12">
      <legend className="text-base font-semibold leading-6 text-gray-900">
        Vendors
      </legend>
      <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
        {vendorData.map((vendor) => (
          <div key={vendor._id} className="relative flex items-start py-4">
            <div className="min-w-0 flex-1 text-sm leading-6">
              <label
                htmlFor={`vendor-${vendor._id}`}
                className="select-none font-medium text-gray-900"
              >
                {vendor.name}
              </label>
            </div>
            <div className="ml-3 flex h-6 items-center">
              <input
                id={`vendor-${vendor._id}`}
                name={`vendor-${vendor._id}`}
                type="checkbox"
                checked={selectedVendorIds.includes(vendor._id)}
                onChange={(e) => onVendorChange(vendor._id, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  )
}
