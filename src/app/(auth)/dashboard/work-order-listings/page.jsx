'use client'
import useSWR from 'swr'
import { XCircleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

const fetcher = (url) => fetch(url).then((res) => res.json())

function isVehicleInfoMissing(vehicle) {
  return !vehicle.make || !vehicle.model || !vehicle.year || !vehicle.vin
}

export default function PartsRequestQueue() {
  const { data: workOrders, error } = useSWR('/api/get-workorders', fetcher);

  if (error) return <div>Error loading work orders</div>;
  if (!workOrders) return <div>Loading...</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Work Orders
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the work orders including their number, vehicle
            details, and parts.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Order Number
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
                {workOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {order.workOrderNumber}
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
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link
                        className="text-blue-600 hover:text-blue-900"
                        href={`/dashboard/work-order-listings/${order.workOrderNumber}`}
                      >
                        Edit
                        <span className="sr-only">
                          Order {order.workOrderNumber}
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
