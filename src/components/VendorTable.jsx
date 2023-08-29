'use client'
import { useState } from 'react'
import SlideOverRequestForm from './SlideOverRequestForm'
import PartRequestWithVendorResponses from './PartRequest'

export default function VendorTable({ data, activeVendors }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="mb-8 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Part Request Status
          </h1>
          {/* <p className="mt-2 text-sm text-gray-700">
            A real-time list of parts showing name, vendor, availability status,
            price, and vendor role for each.{' '}
          </p> */}
        </div>
        {/* <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setOpen(true)}
          >
            Request Part
          </button>
        </div> */}
      </div>
      {data?.map((workOrder, index) => (
        <div key={index} className="mb-8">
          {workOrder.parts.map((part, partIndex) => (
            <PartRequestWithVendorResponses key={partIndex} data={part} />
          ))}
        </div>
      ))}

      {/* <SlideOverRequestForm open={open} setOpen={setOpen} activeVendors={activeVendors} /> */}
    </>
  )
}
