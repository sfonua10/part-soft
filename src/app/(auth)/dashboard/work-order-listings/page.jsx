'use client'
import useSWR from 'swr'
import { XCircleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

const fetcher = (url) => fetch(url).then((res) => res.json())

function isVehicleInfoMissing(vehicle) {
  return !vehicle.make || !vehicle.model || !vehicle.year || !vehicle.vin
}

export default function PartsRequestQueue() {
  const { data: workOrders, error } = useSWR('/api/get-workorders', fetcher)

  if (error) return <div>Error loading work orders</div>
  if (!workOrders) return <div>Loading...</div>
  const sortedData = [...workOrders].sort(
    (a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted),
  )
  function determineBackgroundColor(order) {
    // 1. Check if vehicle info is missing
    // if (isVehicleInfoMissing(order.vehicle)) return 'bg-red-50';

    // 2. Check if all parts have notificationsSent
    const allPartsNotified = order.parts.every(
      (part) => part.notificationsSent !== null,
    )

    if (allPartsNotified) return 'bg-green-50'

    // 3. Check if some parts have notificationsSent
    const somePartsNotified = order.parts.some(
      (part) => part.notificationsSent !== null,
    )

    if (somePartsNotified) return 'bg-yellow-50'

    // 4. Check if all parts have notificationsSent set to null
    const allPartsNotNotified = order.parts.every(
      (part) => part.notificationsSent === null,
    )

    if (allPartsNotNotified) return 'bg-red-50'

    // Default: No background color
    return ''
  }
  console.log(sortedData)
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Work Orders
          </h1>
          {/* <p className="mt-2 text-sm text-gray-700">
            A list of all the work orders including their number, vehicle
            details, and parts.
          </p> */}
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className="sr-only">Notifications</legend>
        <div className="flex space-x-4">
          {[
            ['All parts notified', 'bg-green-50', 'border-green-300'],
            ['Some parts notified', 'bg-yellow-50', 'border-yellow-300'],
            ['No parts notified', 'bg-red-50', 'border-red-300'],
            ['Vehicle details missing', 'bg-red-50', 'border-red-300', true],
          ].map(([notification, bgColor, borderColor, showIcon], index) => {
            const id = notification.toLowerCase().replace(/\s+/g, '-')
            return (
              <div key={index} className="relative flex items-baseline">
                <div className="relative mr-2 flex h-6 items-baseline">
                  {/* If not showIcon, render the input and its styled counterpart */}
                  {!showIcon && (
                    <>
                      <input
                        id={id}
                        name={id}
                        type="checkbox"
                        className={`h-4 w-4 rounded ${bgColor} ${borderColor} focus:ring-0`}
                        style={{ opacity: 0 }}
                        disabled
                        checked
                      />
                      <span
                        className={`absolute left-0 top-0 h-4 w-4 rounded ${bgColor} ${borderColor} pointer-events-none border`}
                      ></span>
                    </>
                  )}
                  {/* If showIcon is true, render the XCircleIcon */}
                  {showIcon && (
                    <XCircleIcon
                      className="h-4 w-4 text-red-500"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <label
                  htmlFor={id}
                  className="flex items-center text-sm font-medium text-gray-900"
                >
                  {notification}
                </label>
              </div>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Work Order #
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Mechanic Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Date Submitted
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Vehicle Details
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Parts
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedData.map((order) => {
                  const date = new Date(order.dateSubmitted)
                  const allPartsNotified = order.parts.every(
                    (part) => part.notificationsSent !== null,
                  )

                  const formattedDate = `${
                    date.getMonth() + 1
                  }/${date.getDate()}/${date.getFullYear()} ${
                    date.getHours() % 12 || 12
                  }:${date.getMinutes().toString().padStart(2, '0')} ${
                    date.getHours() >= 12 ? 'PM' : 'AM'
                  }`
                  return (
                    <tr
                      key={order._id}
                      className={determineBackgroundColor(order)}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-center text-sm font-medium text-gray-900 sm:pl-0">
                        {order.workOrderNumber}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {order.mechanicName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formattedDate}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {order.vehicle.make} {order.vehicle.model}
                        {order.vehicle.year} {order.vehicle.vin}
                        {isVehicleInfoMissing(order.vehicle) && (
                          <div className="mt-2">
                            <div className="flex items-center text-red-500">
                              <XCircleIcon
                                className="mr-2 h-5 w-5"
                                aria-hidden="true"
                              />
                              Missing required vehicle information
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {order.parts.map((part) => part.partName).join(', ')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-0">
                        {allPartsNotified ? (
                          <span className="text-gray-400">Edit</span>
                        ) : (
                          <Link
                            className="text-blue-600 hover:text-blue-900"
                            href={`/dashboard/work-order-listings/${order.workOrderNumber}`}
                          >
                            Edit
                            <span className="sr-only">
                              Order {order.workOrderNumber}
                            </span>
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
