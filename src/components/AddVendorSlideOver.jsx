'use client'
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function AddVendorSliderOver({
  open,
  setOpen,
  vendor,
  setVendors,
}) {
  const [errors, setErrors] = useState({})
  const [name, setName] = useState(vendor?.name || '')
  const [phone, setPhone] = useState(vendor?.phone || '')
  const [email, setEmail] = useState(vendor?.email || '')
  const [primaryContact, setPrimaryContact] = useState(
    vendor?.primaryContact || '',
  )
  useEffect(() => {
    if (vendor) {
      setName(vendor.name || '')
      setPhone(vendor.phone || '')
      setEmail(vendor.email || '')
      setPrimaryContact(vendor.primaryContact || '')
    } else {
      setName('')
      setPhone('')
      setEmail('')
      setPrimaryContact('')
    }
  }, [vendor])
  const validateForm = (data) => {
    const tempErrors = {}

    if (!data.name.trim()) tempErrors.name = 'Vendor name is required.'
    if (!data.primaryContact.trim())
      tempErrors.primaryContact = 'Primary contact name is required.'
    if (
      !data.phone.trim() ||
      !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
        data.phone,
      )
    )
      tempErrors.phone = 'Enter a valid phone number.'
    if (!data.email.trim() || !/^\S+@\S+\.\S+$/.test(data.email))
      tempErrors.email = 'Enter a valid email address.'

    // Add more validations as needed...

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0 // returns true if no errors
  }

  const handleAddVendor = async (e) => {
    e.preventDefault()
    const newVendor = {
      name: e.target['vendor-name'].value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      primaryContact: e.target['primary-contact-name'].value,
      //... add other fields as necessary
    }

    if (validateForm(newVendor)) {
      try {
        const response = await fetch('/api/add-vendor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newVendor),
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const responseData = await response.json()

        // Use responseData if necessary, for example, to get an ID that the server assigned to the new vendor
        setVendors((prevVendors) => [...prevVendors, responseData])
        setOpen(false)
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error)
        // Handle errors: Show an error message, etc.
      }
    }
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target

    switch (name) {
      case 'vendor-name':
        setName(value)
        break
      case 'phone':
        setPhone(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'primary-contact-name':
        setPrimaryContact(value)
        break
      // ... handle other fields
      default:
        break
    }
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={() => setOpen(false)} // This allows the modal to close when the background is clicked
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
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
                      <h2 className="sr-only">Vendors</h2>

                      <div>
                        <form onSubmit={handleAddVendor}>
                          <h2 className="text-lg font-medium text-gray-900">
                            Add a Vendor
                          </h2>
                          <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                            <div className="sm:col-span-2">
                              <label
                                htmlFor="vendor-name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Vendor Name
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  value={name || ''}
                                  onChange={handleInputChange}
                                  id="vendor-name"
                                  name="vendor-name"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.name && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {errors.name}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="sm:col-span-2">
                              <label
                                htmlFor="primary-contact-name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Primary Contact Name
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  value={primaryContact || ''}
                                  onChange={handleInputChange}
                                  id="primary-contact-name"
                                  name="primary-contact-name"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Phone Number
                              </label>
                              <div className="mt-1">
                                <input
                                  type="tel"
                                  value={phone || ''}
                                  onChange={handleInputChange}
                                  name="phone"
                                  id="phone"
                                  autoComplete="tel"
                                  placeholder="+1 (555) 123-4567"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Email
                              </label>
                              <div className="mt-1">
                                <input
                                  type="email"
                                  value={email || ''}
                                  onChange={handleInputChange}
                                  name="email"
                                  id="email"
                                  autoComplete="email"
                                  placeholder="contact@vendor.com"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-2">
                              <label
                                htmlFor="specialization"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Vendor Specialization
                              </label>
                              <div className="mt-1">
                                <textarea
                                  name="specialization"
                                  id="specialization"
                                  onChange={handleInputChange}
                                  rows="3"
                                  placeholder="Brake parts, engine components..."
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                ></textarea>
                              </div>
                            </div>

                            <div className="sm:col-span-2">
                              <button
                                type="submit"
                                className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:border-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
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
