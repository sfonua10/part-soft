'use client'
import { useState, useEffect } from 'react'
import { RadioGroup } from '@headlessui/react'
import { updateWorkOrder } from '@/utils/helpers/apiHelper'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'

import VendorSelection from '@/components/WorkOrderListings/VendorSelection'
import Summary from '@/components/Summary'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { getIconStyles, getButtonStyles, classNames } from '@/utils/buttonStyles'

export default function PartsSelection() {
  const [dataFromPreviousPage, setDataFromPreviousPage] = useState({})
  const [vendorData, setVendorData] = useState([])
  const parts = dataFromPreviousPage?.parts || []
  const [selectedPart, setSelectedPart] = useState({})
  const [selectedVendorIds, setSelectedVendorIds] = useState([])
  const router = useRouter()

  useEffect(() => {
    const workOrderData = JSON.parse(sessionStorage.getItem('workOrderDetails'))
    const vendors = JSON.parse(sessionStorage.getItem('vendorData')) || []

    setDataFromPreviousPage(workOrderData)
    setVendorData(vendors)
  }, [])

  const updateSelectedVendorsInPart = (newVendorIds) => {
    setSelectedPart((prevState) => ({
      ...prevState,
      selectedVendors: newVendorIds,
    }))
  }

  const handleVendorChange = (vendorId, checked) => {
    let newVendorIds

    if (checked) {
      newVendorIds = [...selectedVendorIds, vendorId]
    } else {
      newVendorIds = selectedVendorIds.filter((id) => id !== vendorId)
    }

    setSelectedVendorIds(newVendorIds)
    updateSelectedVendorsInPart(newVendorIds)
  }
  const handleUpdateParts = async () => {
    const selectedPartId = selectedPart._id.$oid
    // Update the parts array by mapping over it and updating the 'selectedVendors' of the selected part
    const updatedParts = dataFromPreviousPage.parts.map((part) => {
      if (part._id.$oid === selectedPartId) {
        return {
          ...part,
          selectedVendors: selectedVendorIds,
        }
      }
      return part
    })

    const updatedWorkOrderDetails = {
      _id: dataFromPreviousPage._id,
      parts: updatedParts,
      selectedPart: selectedPart,
      status: 'Parts and Vendors Updated',
    }

    const result = await updateWorkOrder(updatedWorkOrderDetails)
    if (result.success) {
    
      sessionStorage.setItem(
        'workOrderDetails',
        JSON.stringify(result.data.workOrder),
      )
      sessionStorage.setItem('selectedPart', JSON.stringify(selectedPart))
  
      router.push(
        `/dashboard/work-order-listings/${dataFromPreviousPage.workOrderNumber}/parts-selection/review-message-and-send`,
      )
    } else {
      console.error('Failed to update:', result.error)
    }
  }

  return (
    <div className="gap-12 lg:grid lg:grid-cols-2">
      <div>
        <RadioGroup
          value={selectedPart._id || null}
          onChange={(value) => {
            const selected = parts.find((part) => part._id === value)
            setSelectedPart(selected)
            setSelectedVendorIds([])
          }}
        >
          <RadioGroup.Label className="text-base font-semibold leading-6 text-gray-900">
            Select a part
          </RadioGroup.Label>

          <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
            {parts.map((part) => {
              const notificationSent = part.notificationsSent !== null

              return (
                <RadioGroup.Option
                  key={part._id}
                  value={part._id}
                  disabled={notificationSent} // Disabling the option if notificationSent has a value
                  className={({ checked, active }) =>
                    classNames(
                      notificationSent
                        ? 'border-green-300 ring-2 ring-green-600 bg-green-200'
                        : '', // Apply green background if notification has been sent
                      !notificationSent && active
                        ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-100'
                        : 'border-gray-300',
                      notificationSent
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer', // Use cursor-not-allowed if notificationSent is true
                      'relative flex rounded-lg border bg-white p-4 shadow-sm focus:outline-none',
                    )
                  }
                >
                  {({ checked, active }) => (
                    <>
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <RadioGroup.Label
                            as="span"
                            className="block text-sm font-medium text-gray-900"
                          >
                            {part.partName}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className="mt-1 flex items-center text-sm text-gray-500"
                          >
                            Part Number: {part.partNumber}
                          </RadioGroup.Description>
                          {/* Additional part details can be added here */}
                        </span>
                      </span>
                      <CheckCircleIcon
                        className={classNames(
                          notificationSent || checked ? '' : 'invisible',
                          'h-5 w-5',
                          notificationSent ? 'text-green-600' : 'text-blue-600',
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className={classNames(
                          active ? 'border' : 'border-2',
                          checked ? 'border-blue-600' : 'border-transparent',
                          'pointer-events-none absolute -inset-px rounded-lg',
                        )}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </RadioGroup.Option>
              )
            })}
          </div>
        </RadioGroup>

        <VendorSelection
          vendorData={vendorData}
          selectedVendorIds={selectedVendorIds}
          onVendorChange={handleVendorChange}
        />
        <div className="mt-10 flex justify-between gap-4 border-gray-200 pt-6">
          {/* <Link
            className={getButtonStyles(true)}
            href={`/dashboard/work-order-listings/${dataFromPreviousPage.workOrderNumber}`}
          >
            Back
          </Link> */}
      <Link
            href={`/dashboard/work-order-listings/${dataFromPreviousPage.workOrderNumber}`}
            >
        <ChevronLeftIcon className="h-6 text-gray-400" />
      </Link>
          <button
            disabled={!selectedPart?._id || selectedVendorIds.length === 0}
            className={getButtonStyles(
              selectedPart?._id && selectedVendorIds.length > 0,
            )}
            onClick={handleUpdateParts}
          >
              <ChevronRightIcon className={getIconStyles(selectedPart?._id && selectedVendorIds.length > 0)} />
          </button>
        </div>
      </div>

      <div>
        <Summary
          workOrderNumber={dataFromPreviousPage.workOrderNumber}
          vendorData={vendorData}
          vehicle={dataFromPreviousPage.vehicle || {}}
          selectedPart={selectedPart}
        />
      </div>
    </div>
  )
}
