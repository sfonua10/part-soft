'use client'
import { useState, useEffect } from 'react'
import Summary from '@/components/Summary'
import VendorMessage from '@/components/VendorMessage'
import SendConfirmationModal from '@/components/WorkOrderListings/SendConfirmationModal'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { sendCommunication } from '@/utils/communicationMethods'
import { useRouter } from 'next/navigation'

import Link from 'next/link'
const baseSendButtonStyles =
  'mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'

const getSendButtonStyles = (condition) => {
  return `${baseSendButtonStyles} ${
    condition ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
  }`
}
export default function ReviewMessageAndSend() {
  const router = useRouter()
  const [dataFromPreviousPage, setDataFromPreviousPage] = useState({})
  const [vendorData, setVendorData] = useState([])
  const [selectedPart, setSelectedPart] = useState({})
  const [communicationMethods, setCommunicationMethods] = useState({
    email: false,
    sms: false,
    voiceCall: false,
  })
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const workOrderData = JSON.parse(sessionStorage.getItem('workOrderDetails'))
    const vendors = JSON.parse(sessionStorage.getItem('vendorData')) || []
    const sP = JSON.parse(sessionStorage.getItem('selectedPart')) || {}

    setDataFromPreviousPage(workOrderData)
    setVendorData(vendors)
    setSelectedPart(sP)
  }, [])
  
  const handleConfirmation = async () => {
    // Loop through only the selected vendors
    for (let vendorId of selectedPart.selectedVendors) {
      // Find the vendor from vendorData using the vendorId
      const vendor = vendorData.find((v) => v._id === vendorId)

      if (!vendor) {
        console.error(`Vendor with ID ${vendorId} not found in vendorData`)
        continue // skip to the next iteration if vendor not found
      }

      for (let method in communicationMethods) {
        if (communicationMethods[method]) {
          // If method is selected
          const messageData = {
            _id: dataFromPreviousPage._id,
            workOrderNumber: dataFromPreviousPage.workOrderNumber,
            vehicle: dataFromPreviousPage.vehicle,
            parts: selectedPart,
            vendors: [vendor],
          }
          try {
            await sendCommunication(method, messageData, 'Your message here')
            // Handle any post-send logic if necessary
            router.push('/dashboard')
          } catch (error) {
            console.error(`Failed to send ${method} to ${vendor.name}`, error)
          }
        }
      }
    }
  }

  const handleCommunicationChange = (method) => {
    setCommunicationMethods((prevState) => ({
      ...prevState,
      [method]: !prevState[method],
    }))
  }
  const isAnyMethodSelected = Object.values(communicationMethods).some(
    (value) => value,
  )

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="mt-4 gap-12 lg:grid lg:grid-cols-12">
        {/* Left Side - Summary */}
        <div className="lg:col-span-7">
          <Summary
            workOrderNumber={dataFromPreviousPage.workOrderNumber}
            vendorData={vendorData}
            vehicle={dataFromPreviousPage.vehicle || {}}
            selectedPart={selectedPart}
          />
          <Link
            href={`/dashboard/work-order-listings/${dataFromPreviousPage.workOrderNumber}/parts-selection`}
          >
            <ChevronLeftIcon className="h-6 text-gray-400" />
          </Link>
        </div>

        {/* Right Side - Vendor Messages & Communication Preferences */}
        <div className="lg:col-span-5">
          <VendorMessage
            workOrderNumber={dataFromPreviousPage.workOrderNumber}
            vendorData={vendorData}
            vehicle={dataFromPreviousPage.vehicle || {}}
            selectedPart={selectedPart}
          />

          <div className="mt-6 rounded-md bg-gray-50 p-4">
            <h2 className="text-lg font-medium text-gray-900">
              Communication Preferences
            </h2>
            <fieldset className="mt-3">
              <legend className="sr-only">Select communication methods</legend>
              <div className="space-y-5">
                {[
                  // {
                  //   id: 'email',
                  //   label: 'Email',
                  //   desc: 'Send notifications via Email.',
                  // },
                  {
                    id: 'sms',
                    label: 'SMS',
                    desc: 'Send notifications via SMS.',
                  },
                  // {
                  //   id: 'voiceCall',
                  //   label: 'Voice Call',
                  //   desc: 'Automate voice calls to inform.',
                  // },
                ].map((method) => (
                  <div key={method.id} className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id={method.id}
                        name={method.id}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        checked={communicationMethods[method.id]}
                        onChange={() => handleCommunicationChange(method.id)}
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label
                        htmlFor={method.id}
                        className="font-medium text-gray-900"
                      >
                        {method.label}
                      </label>{' '}
                      {/* <span
                        id={`${method.id}-description`}
                        className="text-gray-500"
                      >
                        <span className="sr-only">{method.label} </span>
                        {method.desc}
                      </span> */}
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
          <div className="text-right">
            <button
              disabled={!isAnyMethodSelected}
              onClick={() => setModalOpen(true)}
              className={getSendButtonStyles(isAnyMethodSelected)}
            >
              Send Messages
            </button>
          </div>
        </div>
      </div>
      <SendConfirmationModal
        open={modalOpen}
        setOpen={setModalOpen}
        onConfirm={handleConfirmation}
        communicationMethods={communicationMethods}
        vendorData={vendorData}
        selectedPart={selectedPart}
      />
    </div>
  )
}
