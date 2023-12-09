'use client'
import { useState, useEffect } from 'react'
import { WorkOrderHeader } from './WorkOrderComponents/WorkOrderHeader'
import { PartSection } from './WorkOrderComponents/PartSection'

export default function VendorTable({ data }) {
  const initialShowWorkOrdersState = data?.reduce((acc, order) => {
    acc[order.workOrderNumber] = true
    return acc
  }, {})

  const [showWorkOrdersState, setShowWorkOrdersState] = useState(
    initialShowWorkOrdersState,
  )

  useEffect(() => {
    const newShowWorkOrdersState = data?.reduce((acc, order) => {
      acc[order.workOrderNumber] = true
      return acc
    }, {})

    setShowWorkOrdersState(newShowWorkOrdersState)
  }, [data])

  const collapseAllWorkOrders = () => {
    const newState = { ...showWorkOrdersState }
    for (let orderNum in newState) {
      newState[orderNum] = false
    }
    setShowWorkOrdersState(newState)
  }

  const expandAllWorkOrders = () => {
    const newState = { ...showWorkOrdersState }
    for (let orderNum in newState) {
      newState[orderNum] = true
    }
    setShowWorkOrdersState(newState)
  }

  const toggleAllWorkOrders = () => {
    const anyExpanded = Object.values(showWorkOrdersState).some(
      (state) => state,
    )
    if (anyExpanded) {
      collapseAllWorkOrders()
    } else {
      expandAllWorkOrders()
    }
  }

  const toggleWorkOrder = (workOrderNumber) => {
    setShowWorkOrdersState((prevState) => ({
      ...prevState,
      [workOrderNumber]: !prevState?.[workOrderNumber],
    }))
  }

  const deleteAllWorkOrders = async () => {
    try {
      const response = await fetch('/api/work-orders', {
        method: 'DELETE',
        header: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      if (response.ok) {
        console.log(result.message)
      } else {
        console.error('Error deleting work orders:', result.message)
      }
    } catch (error) {
      console.error('Error deleting work orders:', error.message)
    }
  }
  return (
    <>
      <div className="mb-2 flex justify-between">
        <button
          onClick={deleteAllWorkOrders}
          type="button"
          className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Delete all workorders
        </button>
        <button
          onClick={toggleAllWorkOrders}
          type="button"
          className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Toggle all work orders
        </button>
      </div>
      <div className="rounded-md border border-gray-200 px-4 sm:px-6 lg:px-8">
        {data?.map((order) => (
          <div key={order.workOrderNumber} className="mb-6">
            <WorkOrderHeader
              order={order}
              showWorkOrder={showWorkOrdersState?.[order.workOrderNumber]}
              toggleWorkOrder={toggleWorkOrder}
            />
            {showWorkOrdersState?.[order.workOrderNumber] &&
              order.parts.map((part) => (
                <PartSection part={part} key={part.partNumber} />
              ))}
            {/* <hr className="mb-4 mt-4" /> */}
          </div>
        ))}
      </div>
    </>
  )
}
