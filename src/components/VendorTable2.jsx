'use client'
import { useState } from 'react'
import SlideOverRequestForm from './SlideOverRequestForm'

const getPartAvailabilityStyles = (availability) => {
  switch (availability) {
    case 'Available':
      return {
        background: 'bg-green-50',
        text: 'text-green-700',
        ring: 'ring-green-600/20',
      }
    case 'Not Available':
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
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
const VendorTable2 = ({ data }) => {
  const [open, setOpen] = useState(false)
    const { partRequest, vendorResponses } = data;

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Part Request Status
            </h1>
            <p className="mt-2 text-sm text-gray-700">
            A real-time list of parts showing name, vendor, availability status, price, and vendor role for each.            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => setOpen(true)}
            >
              Request Part
            </button>
          </div>
        </div>


<div>
    
</div>
        <div className="sm:flex sm:items-center mt-8">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
            Work Order: {partRequest.workOrderNumber}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
            Part Name: {partRequest.partName}
            </p>
            <p className="mt-2 text-sm text-gray-700">
            Year: {partRequest.year} | Vin: {partRequest.vin} | Make: {partRequest.make} | Model: {partRequest.model}
            </p>
          </div>
          {/* <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
            Work Order: {partRequest.workOrderNumber}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
            Part Name: {partRequest.partName}
            </p>
            <p className="mt-2 text-sm text-gray-700">
            Make: {partRequest.make} | Model: {partRequest.model}

            </p>
 
            <p className="mt-2 text-sm text-gray-700">
            Year: {partRequest.year} | Vin: {partRequest.vin}
            </p>
          </div> */}
        </div>







        <div className="flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                    >
                      Vendor Name
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                    >
                      Availability
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Order Status
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      Delivery
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      Part Available
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vendorResponses?.map((vendor, vendorIdx) => (
                    <tr key={vendor._id}>
                      <td
                        className={classNames(
                          vendorIdx !== vendorResponses.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8',
                        )}
                      >
                        {vendor.vendorName}
                      </td>

                      <td
                        className={classNames(
                          vendorIdx !== vendorResponses.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell',
                        )}
                      >
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            getPartAvailabilityStyles(vendor.partAvailable)
                              .background
                          } ${
                            getPartAvailabilityStyles(vendor.partAvailable)
                              .text
                          } ${
                            getPartAvailabilityStyles(vendor.partAvailable)
                              .ring
                          }`}
                        >
                          {vendor.availability}
                        </span>
                      </td>
                      <td
                        className={classNames(
                          vendorIdx !== vendorResponses.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                        )}
                      >
                        {vendor.orderStatus}
                      </td>
                      <td
                        className={classNames(
                          vendorIdx !== vendorResponses.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell',
                        )}
                      >
                        {vendor.price}
                      </td>
                      <td
                        className={classNames(
                          vendorIdx !== vendorResponses.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell',
                        )}
                      >
                        {vendor.delivery}
                      </td>
                      <td
                        className={classNames(
                          vendorIdx !== vendorResponses.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell',
                        )}
                      >
                        {vendor.partAvailable}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>






      </div>
      <SlideOverRequestForm open={open} setOpen={setOpen} />
    </>
  )
}

export default VendorTable2
