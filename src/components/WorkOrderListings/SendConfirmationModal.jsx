'use client'
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  ArrowRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

export default function SendConfirmationModal({
  open,
  setOpen,
  onConfirm,
  communicationMethods,
  vendorData,
  selectedPart,
}) {
  const cancelButtonRef = useRef(null)
  // Filter the selected vendors from vendorData using the selected vendors' IDs from selectedPart.
  const selectedVendors = vendorData.filter((vendor) =>
    selectedPart.selectedVendors.includes(vendor._id),
  )

  // Get the selected communication methods
  const selectedMethods = Object.entries(communicationMethods)
    .filter(([_, value]) => value)
    .map(([key]) => key)

  // Map method name to a readable label
  const methodLabel = {
    email: 'Email',
    sms: 'SMS',
    voiceCall: 'Voice Call',
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 flex h-screen w-screen items-center justify-center overflow-y-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-yellow-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Confirm Message Sending
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to send this message to the vendor?
                      Please double-check the information before proceeding.
                    </p>
                  </div>
                  <div className="mt-2">
                    {selectedVendors.map((vendor) =>
                      selectedMethods.map((method, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {methodLabel[method]}
                          </span>
                          <ArrowRightIcon className="h-6" />
                          <span className="text-sm text-gray-500">
                            {vendor.name}
                          </span>
                        </div>
                      )),
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                  onClick={() => {
                    onConfirm();
                    setOpen(false)
                  }}
                >
                  Send
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
