'use client'
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { useState, Fragment } from 'react'
import {
  getBackgroundColorForAvailability,
  formatDate,
} from '@/utils/dashboard/partdisplay'
import { useSidebar } from '@/app/(auth)/dashboard/sidebar-provider'
import { updateWorkOrder } from '@/utils/helpers/apiHelper'
import useSWR, { mutate } from 'swr'
import { classNames } from '@/utils/classNames'

export default function PartsDisplay({ data, endpointUrl }) {
  const { toggleOpen } = useSidebar()
  const [visibleParts, setVisibleParts] = useState({})
  // Initialize an array of booleans with the same length as transformedData
  const [collapseStates, setCollapseStates] = useState(
    new Array(data.length).fill(false),
  )

  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.dateSubmitted)
    const dateB = new Date(b.dateSubmitted)

    // If dates are the same, sort by workOrderNumber (assuming they are strings)
    if (dateA.getTime() === dateB.getTime()) {
      return b.workOrderNumber.localeCompare(a.workOrderNumber)
    }

    return dateB - dateA // sorts in descending order by date
  })

  function toggleCollapseState(index) {
    const newStates = [...collapseStates]
    newStates[index] = !newStates[index]
    setCollapseStates(newStates)
  }

  function collapseAll() {
    // Check if all work orders are collapsed
    const areAllCollapsed = collapseStates.every((state) => state)

    if (areAllCollapsed) {
      setCollapseStates(new Array(data.length).fill(false))
    } else {
      setCollapseStates(new Array(data.length).fill(true))
    }
  }
  const toggleVisibility = (partId) => {
    setVisibleParts((prev) => ({ ...prev, [partId]: !prev[partId] }))
  }

  const areAllCollapsed = collapseStates.every((state) => state)

  const updatePartStatusById = async (workOrder, partId) => {
    try {
      const updatedParts = workOrder.parts.map((part) =>
        part._id === partId ? { ...part, completed: true } : part,
      )

      const updatedWorkOrder = { ...workOrder, parts: updatedParts }
      const response = await updateWorkOrder(updatedWorkOrder)

      if (response.success) {
        console.log('Work order updated successfully:', response.data)

        // Find the index of the updated work order in the original data array
        const workOrderIndex = data.findIndex(
          (w) => w.workOrderNumber === workOrder.workOrderNumber,
        )

        // If the work order is found, update it locally
        if (workOrderIndex !== -1) {
          const newData = [...data]
          newData[workOrderIndex] = updatedWorkOrder

          // Manually update the local data without re-fetching from the server
          mutate(endpointUrl, newData, false)
        }
      } else {
        console.error('Failed to update work order:', response.error)
      }
    } catch (error) {
      console.error('Error updating part status:', error)
    }
  }

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
            <div
              className={`flex justify-between ${
                areAllCollapsed ? 'border-b-2' : 'border-b-1'
              }`}
            >
              <div className="flex">
                <span className="mr-2 inline-block rounded-t border border-b-0 bg-gray-100 px-3 text-xs text-gray-950">
                  WO: {workOrder.workOrderNumber}
                </span>
                {workOrder.vehicle.year === '' &&
                workOrder.vehicle.make === '' &&
                workOrder.vehicle.model === '' &&
                workOrder.vehicle.vin === '' ? (
                  <span className="inline-block rounded-t border border-b-0 bg-gray-100 px-3 text-xs text-gray-950">
                    Vehicle data not available
                  </span>
                ) : (
                  <span className="mr-2 inline-block rounded-t border border-b-0 bg-gray-100 px-3 text-xs text-gray-950">
                    {workOrder.vehicle.year !== ''
                      ? workOrder.vehicle.year
                      : 'N/A'}{' '}
                    {workOrder.vehicle.make !== ''
                      ? workOrder.vehicle.make
                      : 'N/A'}{' '}
                    {workOrder.vehicle.model !== ''
                      ? workOrder.vehicle.model
                      : 'N/A'}{' '}
                    {workOrder.vehicle.vin !== ''
                      ? workOrder.vehicle.vin
                      : 'N/A'}
                  </span>
                )}
              </div>
              <div className="flex">
                <span className="mr-2 inline-block rounded-t border border-b-0 bg-gray-100 px-3 text-xs">
                  Created:{' '}
                  {workOrder.dateSubmitted
                    ? formatDate(workOrder.dateSubmitted)
                    : 'N/A'}
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
                    <Fragment key={part._id}>
                      {/* Part header */}
                      <tr className="group border-t border-gray-200 bg-gray-50 hover:bg-gray-100">
                        <th
                          colSpan={5}
                          scope="colgroup"
                          className="py-2 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-3"
                        >
                          <div className="flex w-full items-center justify-between">
                            <span>
                              {part.partName} - {part.partNumber}
                            </span>
                            {part.completed ? (
                              <div className="flex items-center space-x-1 text-green-500">
                                <span className="flex items-center gap-1 rounded border border-green-500 bg-green-50 px-2 py-1 text-xs font-semibold text-green-900">
                                  Completed
                                  <CheckCircleIcon className="h-5 w-5" />
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleVisibility(part._id)}
                                  className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                  {visibleParts[part._id] ? 'Hide' : 'Show'}
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  updatePartStatusById(workOrder, part._id)
                                }
                                className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 group-hover:opacity-100"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </th>
                      </tr>

                      {/* Vendor responses */}
                      {!part.completed || visibleParts[part._id] ? (
                        part.vendorResponses.length === 0 ? (
                          <tr className="border-t border-gray-200">
                            <td
                              colSpan={5}
                              className="whitespace-nowrap bg-blue-50 px-3 py-4 text-sm text-gray-500"
                            >
                              Parts Manager needs to review
                            </td>
                          </tr>
                        ) : (
                          part.vendorResponses.map((vendor, vendorIdx) => (
                            <tr
                            key={vendor.vendorName}
                            className={classNames(
                              vendorIdx === 0 ? 'border-gray-300' : 'border-gray-200',
                              'border-t',
                              getBackgroundColorForAvailability(vendor.availability),
                            )}
                          >
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
                          </tr>
                          ))
                        )
                      ) : null}
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
