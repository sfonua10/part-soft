'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import VehicleInfo from '@/components/RequestPart/VehicleInfo'
import { useRouter } from 'next/navigation'
import Summary from '@/components/Summary'
import { updateWorkOrder } from '@/utils/helpers/apiHelper'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { getButtonStyles, getIconStyles } from '@/utils/buttonStyles'
import { fetcher } from '@/utils/fetcher'

const WorkOrderDetailsPage = ({ params }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const userId = session?.user?.id
  const workOrderNumber = params.workOrderId

  const workOrderApiUrl =
    userId && workOrderNumber
      ? `/api/get-workorders?workOrderId=${workOrderNumber}&userId=${userId}`
      : null

  const vendorApiUrl = userId ? `/api/vendor-info?userId=${userId}` : null

  const { data: workOrder, error: workOrderError } = useSWR(
    workOrderApiUrl,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  )

  const { data: vendorData } = useSWR(vendorApiUrl, fetcher, {
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
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    const workOrderDetails = {
      _id: workOrder._id,
      vehicle: vehicle,
      status: 'Vehicle Details Added',
    }

    const result = await updateWorkOrder(workOrderDetails)

    if (result.success) {
      sessionStorage.setItem(
        'workOrderDetails',
        JSON.stringify({ ...workOrder, vehicle: vehicle }),
      )
      sessionStorage.setItem('vendorData', JSON.stringify(vendorData))
      router.push(
        `/dashboard/work-order-listings/${workOrderNumber}/parts-selection`,
      )
    } else {
      console.error('Failed to update:', result.error)
    }
  }

  if (workOrderError) return <div>Error loading work order</div>
  if (!workOrder) return <div>Loading...</div>

  const isFormFilled = () => {
    return vehicle.make && vehicle.model && vehicle.year && vehicle.vin
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-2xl">Work Order Details Page {workOrderNumber}</h1>
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
                <ChevronRightIcon className={getIconStyles(isFormFilled())} />
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
