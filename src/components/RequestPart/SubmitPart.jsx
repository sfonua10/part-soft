import { CheckBadgeIcon } from "@heroicons/react/24/outline"
const baseButtonStyles =
  'w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm hover:bg--[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto'
const getButtonStyles = (condition) => {
  return `${baseButtonStyles} ${
    condition
      ? 'bg-[#2563eb] text-white'
      : 'cursor-not-allowed bg-[#2563eb] opacity-50'
  }`
}
const SubmitPart = ({
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
                  className="select-none font-medium text-gray-900 flex items-center"
                >
                  {vendor.name} { vendor.isSaved && <CheckBadgeIcon className="h-6 text-green-400 pl-2" /> }
                </label>
              </div>
              <div className="ml-3 flex h-6 items-center">
                <input
                  id={`person-${vendor._id}`}
                  name={`person-${vendor._id}`}
                  type="checkbox"
                  checked={vendor.isActive}
                  onChange={() => handleCheckboxChange(vendor._id)}
                  className="h-4 w-4 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
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
        <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left flex">
          Part request will be sent to vendors with <CheckBadgeIcon className="h-6 text-green-400 pl-2" />
        </p>
      </div>
    </div>
  </section>
)
export default SubmitPart
