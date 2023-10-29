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

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
export default function PartsDisplay({ data }) {
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
    <div className="px-8 sm:px-12 lg:px-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold leading-8 text-gray-900">
          Work Order and Parts
        </h1>
        <button
          onClick={collapseAll}
          type="button"
          className="block rounded-md bg-blue-600 px-5 py-3 text-lg font-semibold text-white shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
        >
          {areAllCollapsed ? 'Expand All' : 'Collapse All'}
        </button>
      </div>

      <div className="mt-12">
        {sortedData?.map((workOrder, workOrderIdx) => (
          <div key={workOrder.workOrderNumber} className="mb-10">
            {/* Tabs */}
            <div key={workOrder.workOrderNumber} className="mb-8">
  <div className="flex justify-between items-center py-3 border-b-2 border-gray-300 mb-4">
    <div className="flex">
      <div className="mr-2 text-xl font-semibold">
        WO: {workOrder.workOrderNumber}
      </div>

      { 
        workOrder.vehicle.year === 'N/A' && 
        workOrder.vehicle.make === 'N/A' && 
        workOrder.vehicle.model === 'N/A' && 
        workOrder.vehicle.vin === 'N/A' ? (
          <div className="ml-4 text-lg text-gray-950">
            Vehicle data not available
          </div>
        ) : (
          <div className="ml-4 text-lg text-gray-950">
            {workOrder.vehicle.year !== 'N/A' ? workOrder.vehicle.year : 'N/A'}{' '}
            {workOrder.vehicle.make !== 'N/A' ? workOrder.vehicle.make : 'N/A'}{' '}
            {workOrder.vehicle.model !== 'N/A' ? workOrder.vehicle.model : 'N/A'}{' '}
            {workOrder.vehicle.vin !== 'N/A' ? workOrder.vehicle.vin : 'N/A'}
          </div>
        )
      }
    </div>

    <div className="flex">
      <div className="text-lg mr-4">
        Created: {workOrder.dateSubmitted ? workOrder.dateSubmitted : 'N/A'}
      </div>

      <button
        onClick={() => toggleCollapseState(workOrderIdx)}
        className="text-2xl text-blue-600 hover:text-blue-900"
      >
        {collapseStates[workOrderIdx] ? (
          <ArrowUpCircleIcon className="h-7 w-7" />
        ) : (
          <ArrowDownCircleIcon className="h-7 w-7" />
        )}
      </button>
    </div>
  </div>
</div>


            {!collapseStates[workOrderIdx] && (
              <table className="min-w-full rounded-b-lg border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-4 pl-6 pr-4 text-left text-lg font-bold text-gray-900">
                      Vendor
                    </th>
                    <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">
                      Availability
                    </th>
                    <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">
                      Order Status
                    </th>
                    <th className="px-6 py-4 text-left text-lg font-bold text-gray-900">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {workOrder.parts.map((part) => (
                    <Fragment key={part.name}>
                      {/* Part header */}
                      <tr className="border-t border-gray-300 bg-gray-50">
                        <th
                          colSpan={5}
                          scope="colgroup"
                          className="py-3 pl-6 pr-4 text-left text-lg font-semibold text-gray-900"
                        >
                          {part.name}
                        </th>
                      </tr>
                      {part.vendors.length === 0 ? (
                        <tr className="border-t border-gray-200">
                          <td
                            colSpan={5}
                            className="whitespace-nowrap bg-blue-50 px-6 py-5 text-lg text-gray-500"
                          >
                            Parts Manager needs to review
                          </td>
                        </tr>
                      ) : (
                        part.vendors.map((vendor, vendorIdx) => (
                          <tr
                            key={vendor.vendorName}
                            className={classNames(
                              'border-t',
                              getBackgroundColorForAvailability(vendor.availability),
                            )}
                          >
                            <td className="whitespace-nowrap py-5 pl-6 pr-4 text-lg text-gray-900">
                              {vendor.vendorName}
                            </td>
                            <td className="whitespace-nowrap px-6 py-5 text-lg text-gray-900">
                              {vendor.availability}
                            </td>
                            <td className="whitespace-nowrap px-6 py-5 text-lg text-gray-900">
                              {vendor.orderStatus}
                            </td>
                            <td className="whitespace-nowrap px-6 py-5 text-lg text-gray-900">
                              {vendor.price}
                            </td>
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
