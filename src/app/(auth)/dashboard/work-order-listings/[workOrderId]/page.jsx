'use client'
import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import VehicleInfo from '@/components/RequestPart/VehicleInfo'
import PartsList from '@/components/WorkOrderListings/PartsList'

const fetcher = (url) => fetch(url).then((res) => res.json())
const vendor1 = {
  _id: {
    $oid: '65242824bc9953b8610c79e8',
  },
  name: 'Siosaia Fonua',
  phone: '+8017229591',
  email: 'saiafonua@gmail.com',
  primaryContact: 'saia',
  specialization: '',
  isActive: false,
  isSaved: false,
  __v: {
    $numberInt: '0',
  },
}

const vendor2 = {
  _id: {
    $oid: '65242824bc9953b8610c79e9',
  },
  name: 'Vendor XYZ',
  phone: '+8017229592',
  email: 'vendorxyz@gmail.com',
  primaryContact: 'xyz',
  specialization: '',
  isActive: true,
  isSaved: true,
  __v: {
    $numberInt: '0',
  },
}

// Transforming these vendors into the structure required for the `react-select` component
const allVendors = [
  { label: vendor1.name, value: vendor1.name },
  { label: vendor2.name, value: vendor2.name },
]

const WorkOrderDetailsPage = ({ params }) => {
  const workOrderNumber = params.workOrderId
  const { data: workOrder, error } = useSWR(
    workOrderNumber
      ? `/api/get-workorders?workOrderId=${workOrderNumber}`
      : null,
    fetcher,
    { revalidateOnFocus: false },
  )

  // Maintain a state for the vehicle information and work order number
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
  })
  const [workOrderNum, setWorkOrderNum] = useState('')
  const [parts, setParts] = useState([])

  useEffect(() => {
    if (workOrder) {
      setVehicle(workOrder.vehicle)
      setWorkOrderNum(workOrder.workOrderNumber)
      setParts(workOrder.parts)
    }
  }, [workOrder])

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target
    setVehicle((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleVendorChange = (selectedVendors, partId) => {
    setParts((prevParts) => {
      const updatedParts = prevParts.map((part) => {
        console.log(part._id, partId, part._id === partId)

        if (part._id === partId) {
          return {
            ...part,
            selectedVendors: selectedVendors.map((vendor) => vendor.value),
          }
        }
        return part
      })

      return updatedParts
    })
  }

  const handleUpdateWorkOrder = async () => {
    try {
      const response = await fetch('/api/update-workorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: workOrder._id,
          vehicle: vehicle,
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Handle success - maybe show a notification or refresh the data
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Failed to update:', error)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    handleUpdateWorkOrder()
  }

  if (error) return <div>Error loading work order</div>
  if (!workOrder) return <div>Loading...</div>
  const baseButtonStyles =
    'w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm hover:bg--[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto'
  const getButtonStyles = (condition) => {
    return `${baseButtonStyles} ${
      condition
        ? 'bg-[#2563eb] text-white'
        : 'cursor-not-allowed bg-[#2563eb] opacity-50'
    }`
  }
  const isFormFilled = () => {
    return vehicle.make && vehicle.model && vehicle.year && vehicle.vin
  }

  return (
    <div>
      <h1>Work Order Details Page {workOrderNumber}</h1>
      <form onSubmit={handleFormSubmit}>
        <VehicleInfo
          vehicle={vehicle}
          handleVehicleInputChange={handleVehicleInputChange}
          errors={{}} // TODO: manage errors
          workOrderNumber={workOrderNum}
          setWorkOrderNumber={setWorkOrderNum}
        />
        <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={!isFormFilled()}
            className={getButtonStyles(isFormFilled())}
          >
            Update Vehicle
          </button>
        </div>
      </form>
      <PartsList
        parts={parts}
        allVendors={allVendors}
        onVendorChange={handleVendorChange}
      />
    </div>
  )
}

export default WorkOrderDetailsPage
