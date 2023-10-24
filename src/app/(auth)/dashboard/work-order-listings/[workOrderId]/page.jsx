'use client'
import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import VehicleInfo from '@/components/RequestPart/VehicleInfo'
import { useRouter } from 'next/navigation'
import Summary from '@/components/Summary'
import { updateWorkOrder } from '@/utils/helpers/apiHelper'

const fetcher = (url) => fetch(url).then((res) => res.json())

const WorkOrderDetailsPage = ({ params }) => {
  const router = useRouter()
  const workOrderNumber = params.workOrderId
  const { data: workOrder, error } = useSWR(
    workOrderNumber
      ? `/api/get-workorders?workOrderId=${workOrderNumber}`
      : null,
    fetcher,
    { revalidateOnFocus: false },
  )
  const { data: vendorData } = useSWR('/api/vendor-info', fetcher, {
    revalidateOnFocus: false,
  })

  // Maintain a state for the vehicle information and work order number
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
  })
  const [workOrderNum, setWorkOrderNum] = useState('')
  const [hasDataChanged, setHasDataChanged] = useState(false)

  useEffect(() => {
    if (workOrder) {
      setVehicle(workOrder.vehicle)
      setWorkOrderNum(workOrder.workOrderNumber)
    }
  }, [workOrder])

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target
    setVehicle((prev) => ({
      ...prev,
      [name]: value,
    }))
    setHasDataChanged(true)
  }

  const handleUpdateWorkOrder = async () => {
    const workOrderDetails = {
      _id: workOrder._id,
      vehicle: vehicle,
      status: 'Vehicle Details Added',
    }

    const result = await updateWorkOrder(workOrderDetails)

    if (result.success) {
      sessionStorage.setItem('workOrderDetails', JSON.stringify({ ...workOrder, vehicle: vehicle }))
      sessionStorage.setItem('vendorData', JSON.stringify(vendorData))
      router.push(
        `/dashboard/work-order-listings/${workOrderNumber}/parts-selection`,
      )
    } else {
      console.error('Failed to update:', result.error)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    handleUpdateWorkOrder()
  }

  if (error) return <div>Error loading work order</div>
  if (!workOrder) return <div>Loading...</div>

  const baseButtonStyles =
    'w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm hover:bg--[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:w-auto'

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
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className='text-2xl'>Work Order Details Page {workOrderNumber}</h1>
        <form
          onSubmit={handleFormSubmit}
          className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
        >
          <section className="lg:col-span-7">
            <VehicleInfo
              vehicle={vehicle}
              handleVehicleInputChange={handleVehicleInputChange}
              errors={{}} // TODO: manage errors
              workOrderNumber={workOrderNum}
              setWorkOrderNumber={setWorkOrderNum}
            />
            <div className="mt-10 flex justify-end gap-4 border-t border-gray-200 pt-6">
              <button
                type="submit"
                disabled={!isFormFilled()}
                className={getButtonStyles(isFormFilled())}
                onClick={handleFormSubmit}
              >
                Next
              </button>
            </div>
          </section>
          <Summary workOrderNumber={workOrderNumber} vehicle={vehicle} />
        </form>
      </div>
    </div>
  )
}

export default WorkOrderDetailsPage
