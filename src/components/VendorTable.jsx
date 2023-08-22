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
const VendorTable = ({ data }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Part Request Status
            </h1>
            <p className="mt-2 text-sm text-gray-700">
            A list of all the parts including the part name, vendor name, availability status, price, and vendor&apos;s role for each part. This list provides real-time status updates from vendors on the availability and pricing of their parts.
            </p>
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
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                    >
                      Available
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Order Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((person, personIdx) => (
                    <tr key={person._id}>
                      <td
                        className={classNames(
                          personIdx !== data.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8',
                        )}
                      >
                        {person.name}
                      </td>

                      <td
                        className={classNames(
                          personIdx !== data.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell',
                        )}
                      >
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            getPartAvailabilityStyles(person.partAvailable)
                              .background
                          } ${
                            getPartAvailabilityStyles(person.partAvailable)
                              .text
                          } ${
                            getPartAvailabilityStyles(person.partAvailable)
                              .ring
                          }`}
                        >
                          {person.partAvailable}
                        </span>
                      </td>
                      <td
                        className={classNames(
                          personIdx !== data.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell',
                        )}
                      >
                        {person.price}
                      </td>
                      <td
                        className={classNames(
                          personIdx !== data.length - 1
                            ? 'border-b border-gray-200'
                            : '',
                          'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
                        )}
                      >
                        {person.orderStatus}
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

export default VendorTable
