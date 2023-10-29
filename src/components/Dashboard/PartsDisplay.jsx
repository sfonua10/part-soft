'use client'
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from '@heroicons/react/24/outline'
import { useState, Fragment } from 'react'
import {
  transformData,
  getBackgroundColorForAvailability,
} from '@/utils/dashboard/partdisplay'
import { useSidebar } from '@/app/(auth)/dashboard/sidebar-provider'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
export default function PartsDisplay({ data }) {
  const { toggleOpen } = useSidebar();
  const transformedData = transformData(data)
  const sortedData = [...transformedData].sort((a, b) => {
    const dateA = new Date(a.dateSubmitted)
    const dateB = new Date(b.dateSubmitted)

    // If dates are the same, sort by workOrderNumber (assuming they are strings)
    if (dateA.getTime() === dateB.getTime()) {
      return b.workOrderNumber.localeCompare(a.workOrderNumber)
    }

    return dateB - dateA // sorts in descending order by date
  })

  // Initialize an array of booleans with the same length as transformedData
  const [collapseStates, setCollapseStates] = useState(
    new Array(transformedData.length).fill(false),
  )

  function toggleCollapseState(index) {
    const newStates = [...collapseStates]
    newStates[index] = !newStates[index]
    setCollapseStates(newStates)
  }
  function collapseAll() {
    // Check if all work orders are collapsed
    const areAllCollapsed = collapseStates.every((state) => state)

    if (areAllCollapsed) {
      setCollapseStates(new Array(transformedData.length).fill(false))
    } else {
      setCollapseStates(new Array(transformedData.length).fill(true))
    }
  }

  const areAllCollapsed = collapseStates.every((state) => state)
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">
            Work Order and Parts
          </h1>
          {/* <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p> */}
          {/* <button onClick={() => toggleOpen()}>Close Side</button> */}
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={collapseAll}
            type="button"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {areAllCollapsed ? 'Expand All' : 'Collapse All'}
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        {sortedData?.map((workOrder, workOrderIdx) => (
          <div key={workOrder.workOrderNumber} className="mb-8">
            {/* Tabs */}
            <div className={`flex justify-between ${areAllCollapsed ? 'border-b-2' : 'border-b-1'}`}>
              <div className="flex">
                <span className="mr-2 inline-block rounded-t border border-b-0 bg-gray-100 text-gray-950 px-3 text-xs">
                  WO: {workOrder.workOrderNumber}
                </span>
                { 
            workOrder.vehicle.year === 'N/A' && 
            workOrder.vehicle.make === 'N/A' && 
            workOrder.vehicle.model === 'N/A' && 
            workOrder.vehicle.vin === 'N/A' ? (
              <span className="inline-block rounded-t border border-b-0 bg-gray-100 px-3 text-xs text-gray-950">
                Vehicle data not available
              </span>
            ) : (
              <span className="mr-2 inline-block rounded-t border border-b-0 bg-gray-100 px-3 text-xs text-gray-950">
                {workOrder.vehicle.year !== 'N/A' ? workOrder.vehicle.year : 'N/A'}{' '}
                {workOrder.vehicle.make !== 'N/A' ? workOrder.vehicle.make : 'N/A'}{' '}
                {workOrder.vehicle.model !== 'N/A' ? workOrder.vehicle.model : 'N/A'}{' '}
                {workOrder.vehicle.vin !== 'N/A' ? workOrder.vehicle.vin : 'N/A'}
              </span>
            )
          }
              </div>
              <div className="flex">
                <span className="mr-2 inline-block rounded-t border border-b-0 bg-gray-100 px-3 text-xs">
                  Created:{' '}
                  {workOrder.dateSubmitted ? workOrder.dateSubmitted : 'N/A'}
                </span>
                <span className="inline-flex items-center justify-center rounded-t border border-b-0 bg-gray-100 px-3 text-xs">
                  <button
                    onClick={() => toggleCollapseState(workOrderIdx)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {collapseStates[workOrderIdx] ? (
                      <ArrowUpCircleIcon className="h-4" />
                    ) : (
                      <ArrowDownCircleIcon className="h-4" />
                    )}
                  </button>
                </span>
              </div>
            </div>

            {!collapseStates[workOrderIdx] && (
              <table className="min-w-full rounded-b-lg border">
                <thead className="bg-white">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                      Vendor
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Availability
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Order Status
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    {/* <th className="px-3 py-3.5 text-right text-sm">
                      <button
                        onClick={() => toggleCollapseState(workOrderIdx)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {collapseStates[workOrderIdx] ? (
                          <ArrowUpCircleIcon className="h-6" />
                        ) : (
                          <ArrowDownCircleIcon className="h-6" />
                        )}
                      </button>
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {workOrder.parts.map((part) => (
                    <Fragment key={part.name}>
                      {/* Part header */}
                      <tr className="border-t border-gray-200 bg-gray-50">
                        <th
                          colSpan={5}
                          scope="colgroup"
                          className="py-2 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-3"
                        >
                          {part.name}
                        </th>
                      </tr>
                      {part.vendors.length === 0 ? (
                        <tr className="border-t border-gray-200">
                          <td
                            colSpan={5}
                            className="whitespace-nowrap bg-blue-50 px-3 py-4 text-sm text-gray-500"
                          >
                            Parts Manager needs to review
                          </td>
                        </tr>
                      ) : (
                        part.vendors.map((vendor, vendorIdx) => (
                          <tr
                            key={vendor.vendorName}
                            className={classNames(
                              vendorIdx === 0
                                ? 'border-gray-300'
                                : 'border-gray-200',
                              'border-t',
                              getBackgroundColorForAvailability(
                                vendor.availability,
                              ), // Set background color here
                            )}
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-normal text-gray-900 sm:pl-3">
                              {vendor.vendorName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              {vendor.availability}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              {vendor.orderStatus}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              {vendor.price}
                            </td>
                            {/* <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                              <a
                                href="#"
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                                <span className="sr-only">
                                  , {vendor.vendorName}
                                </span>
                              </a>
                            </td> */}
                          </tr>
                        ))
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
