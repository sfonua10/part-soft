const baseButtonStyles =
  'w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto'
const getButtonStyles = (condition) => {
  return `${baseButtonStyles} ${
    condition
      ? 'bg-indigo-600 text-white'
      : 'cursor-not-allowed bg-indigo-300 opacity-50'
  }`
}
const VendorSection = ({
  myVendors,
  handleCheckboxChange,
  saveSelections,
  hasVendorChanges,
}) => (
  <section
    aria-labelledby="summary-heading"
    // className="px-4 pb-36 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:order-2 lg:px-0 lg:pb-16"
    //if i want to revert the order again, use the one commented below instead of the one above
    className="bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
  >
    <div className="mx-auto max-w-lg lg:max-w-none">
      <fieldset>
        <legend className="text-lg font-medium leading-6 text-gray-900">
          Vendors
        </legend>
        <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
          {myVendors?.map((vendor) => (
            <div key={vendor._id} className="relative flex items-start py-4">
              <div className="min-w-0 flex-1 text-sm leading-6">
                <label
                  htmlFor={`person-${vendor._id}`}
                  className="select-none font-medium text-gray-900"
                >
                  {vendor.name}
                </label>
              </div>
              <div className="ml-3 flex h-6 items-center">
                <input
                  id={`person-${vendor._id}`}
                  name={`person-${vendor._id}`}
                  type="checkbox"
                  checked={vendor.isActive}
                  onChange={() => handleCheckboxChange(vendor._id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
            </div>
          ))}
        </div>
      </fieldset>
      <div className="mt-4 border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={saveSelections}
          disabled={!hasVendorChanges}
          className={getButtonStyles(hasVendorChanges)}
        >
          Save Vendors
        </button>
        <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left">
          Confirm any changes made to vendor statuses.
        </p>
      </div>
    </div>
  </section>
)
export default VendorSection
