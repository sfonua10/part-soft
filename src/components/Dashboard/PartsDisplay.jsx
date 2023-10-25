'use client'
import { useState, Fragment } from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function PartsDisplay({ data }) {
  console.log('data', data)
  const [arePartsCollapsed, setArePartsCollapsed] = useState(false)

  function getBackgroundColorForAvailability(availability) {
    switch (availability) {
      case 'In Stock':
        return 'bg-green-50';
      case 'Out of Stock':
        return 'bg-red-50';
      default:
        return ''; // or some default color
    }
  }
  function transformData(dataArray) {
    return dataArray.map((item) => ({
      workOrderNumber: item.workOrderNumber,
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
    }))
  }

  const transformedData = transformData(data)
  console.log('transformedData', transformedData)
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Add user
          </button>
        </div>
      </div> */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full">
              <thead className="bg-white">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                  >
                    Vendor
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Availability
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Order Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm sm:pr-3"
                  >
                    <button
                      onClick={() => setArePartsCollapsed(!arePartsCollapsed)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {arePartsCollapsed ? 'Expand All' : 'Collapse All'}
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {!arePartsCollapsed &&
                  transformedData?.map((workOrder) => (
                    <Fragment key={workOrder.workOrderNumber}>
                      {workOrder.parts.map((part) => (
                        <Fragment key={part.name}>
                          <tr className="border-t border-gray-200">
                            <th
                              colSpan={5}
                              scope="colgroup"
                              className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                            >
                              WO {workOrder.workOrderNumber} - {part.name}
                              {part.partNumber}
                            </th>
                          </tr>

                          {part.vendors.length === 0 ? (
                            <tr className="border-t border-gray-200">
                              <td
                                colSpan={5}
                                className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 bg-yellow-50"
                              >
                                Parts Manager needs to review
                              </td>
                            </tr>
                          ) : (
                            part.vendors.map((vendor, vendorIdx) => (
                                <tr
                                key={vendor.vendorName}
                                className={classNames(
                                  vendorIdx === 0 ? 'border-gray-300' : 'border-gray-200',
                                  'border-t',
                                  getBackgroundColorForAvailability(vendor.availability) // Set background color here
                                )}
                              >
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                  {vendor.vendorName}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {vendor.availability}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {vendor.orderStatus}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {vendor.price}
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                  <a
                                    href="#"
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Edit
                                    <span className="sr-only">
                                      , {vendor.vendorName}
                                    </span>
                                  </a>
                                </td>
                              </tr>
                            ))
                          )}
                        </Fragment>
                      ))}
                    </Fragment>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
