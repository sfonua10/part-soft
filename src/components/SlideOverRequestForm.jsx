'use client'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { PhotoIcon } from '@heroicons/react/24/solid'

export default function SlideOverRequestForm({ open, setOpen }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [vin, setVin] = useState('')
  const [partNumber, setPartNumber] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError(null)
    setSuccess(false)

    const year = e.target.year.value
    const make = e.target.make.value
    const model = e.target.model.value
    const vin = e.target.vin.value
    const partNumber = e.target['part-number'].value

    // Create a simple JavaScript object
    const formPayload = {
      year: year,
      make: make,
      model: model,
      vin: vin,
      partNumber: partNumber,
      // images: imagesBase64,
    }

    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formPayload), // Convert object to JSON string
      })

      const data = await response.json()
      console.log(data.message) // "Messages sent"
      // Reset form fields after successful submission
      setYear('')
      setMake('')
      setModel('')
      setVin('')
      setPartNumber('')
      setToastMessage('Form submitted successfully!')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000) // Hide toast after 3 seconds
      setOpen(false)
    } catch (error) {
      // Handle the error
      console.error('Error:', error)
      setError(error.message || 'An error occurred.')
      setToastMessage('An error occurred. Please try again.')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000) // Hide toast after 3 seconds
    }
    setLoading(false)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            {/* Adjusted the positioning container */}
            <div className="pointer-events-none fixed inset-x-0 bottom-0 flex max-w-full justify-end pb-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Dialog.Panel className="pointer-events-auto h-3/5 w-screen max-w-md">
                  {' '}
                  {/* Set height to 60% */}
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Panel title
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <form
                        className="mx-auto max-w-3xl"
                        onSubmit={handleSubmit}
                      >
                        <div className="space-y-12">
                          <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                              Vehicle Information
                            </h2>

                            {/* Adjust the grid for responsive layout */}
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                              {/* Year */}
                              <div>
                                <label
                                  htmlFor="year"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Year
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="year"
                                    id="year"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                  />
                                </div>
                              </div>

                              {/* Make */}
                              <div>
                                <label
                                  htmlFor="make"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Make
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="make"
                                    id="make"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={make}
                                    onChange={(e) => setMake(e.target.value)}
                                  />
                                </div>
                              </div>

                              {/* Model */}
                              <div>
                                <label
                                  htmlFor="model"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Model
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="model"
                                    id="model"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                  />
                                </div>
                              </div>

                              {/* VIN */}
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="vin"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  VIN
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="vin"
                                    id="vin"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={vin}
                                    onChange={(e) => setVin(e.target.value)}
                                  />
                                </div>
                              </div>

                              {/* Part Number */}
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="part-number"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Part Number
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="part-number"
                                    id="part-number"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={partNumber}
                                    onChange={(e) =>
                                      setPartNumber(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-center sm:justify-end">
                            <button
                              type="submit"
                              className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
