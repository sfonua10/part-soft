'use client'
import { Fragment, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Notification from './Notification'

export default function AddVendorSliderOver({
  open,
  setOpen,
  vendor,
  onAddVendor,
  onUpdateVendor,
}) {
  const { data: session } = useSession()
  const [errors, setErrors] = useState({})
  const [formState, setFormState] = useState({
    name: vendor?.name || '',
    phone: vendor?.phone || '',
    email: vendor?.email || '',
    primaryContact: vendor?.primaryContact || '',
    specialization: vendor?.specialization || '',
  })

  const [show, setShow] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('success')

  const [initialState, setInitialState] = useState({
    name: vendor?.name || '',
    phone: vendor?.phone || '',
    email: vendor?.email || '',
    primaryContact: vendor?.primaryContact || '',
    specialization: vendor?.specialization || '',
  })
  const isObjectEmpty = (obj) => Object.keys(obj).length === 0

  const mode = !isObjectEmpty(vendor) ? 'edit' : 'new'

  useEffect(() => {
    const newState = {
      name: vendor?.name || '',
      phone: vendor?.phone || '',
      email: vendor?.email || '',
      primaryContact: vendor?.primaryContact || '',
      specialization: vendor?.specialization || '',
    }

    setFormState(newState)
    setInitialState(newState)
  }, [vendor])

  useEffect(() => {
    if (vendor) {
      setFormState({
        name: vendor.name || '',
        phone: vendor.phone || '',
        email: vendor.email || '',
        primaryContact: vendor.primaryContact || '',
        specialization: vendor.specialization || '',
      })
    } else {
      setFormState({
        name: '',
        phone: '',
        email: '',
        primaryContact: '',
        specialization: '',
      })
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

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleVendorSubmit = async (e) => {
    e.preventDefault()

    const vendorData = {
      _id: vendor ? vendor._id : undefined,
      organizationId: session?.user?.organizationId,
      ...formState,
    }

    if (validateForm(vendorData)) {
      let url, method

      url = `/api/vendors`
      if (mode === 'edit' && vendor && vendor._id) {
        method = 'PUT'
      } else {
        method = 'POST'
      }

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vendorData),
        })

        const responseData = await response.json()

        if (response.ok) {
          if (mode === 'new') {
            // Call the function passed from VendorForm to add the new vendor to the state
            onAddVendor(responseData)
          } else {
            onUpdateVendor(responseData) // Update the vendor list in VendorForm
            // For editing, you might need to handle state update differently
            // For instance, updating the existing vendor's data in the list
          }

          setOpen(false)
          setShow(true)
          setMessage(
            mode === 'edit'
              ? 'Successfully updated the vendor.'
              : 'Successfully added the vendor.',
          )
          setType('success')
          setTimeout(() => setShow(false), 3000)
        } else {
          // Handle the error in the UI, like showing an error message
          setShow(true)
          setMessage(
            'There was a problem with the vendor operation. Please try again.',
          )
          setType('error')
          setTimeout(() => setShow(false), 5000)
          console.error('Server responded with an error:', responseData.message)
        }
      } catch (error) {
        // Handle the error in the UI, like showing an error message
        setShow(true)
        setMessage('There was a problem with the network. Please try again.')
        setType('error')
        setTimeout(() => setShow(false), 5000)
        console.error('There was a problem with the fetch operation:', error)
      }
    }
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const formIsUnchanged = () => {
    return JSON.stringify(formState) === JSON.stringify(initialState)
  }
  return (
    <>
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
                            {mode === 'edit' ? 'Edit Vendor' : 'Add a Vendor'}
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <h2 className="sr-only">Vendors</h2>

                        <div>
                          <form onSubmit={handleVendorSubmit}>
                            {/* <h2 className="text-lg font-medium text-gray-900">
                            Add a Vendor
                          </h2> */}
                            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                              <div className="sm:col-span-2">
                                <label
                                  htmlFor="name"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Vendor Name
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    value={formState.name || ''}
                                    onChange={handleInputChange}
                                    id="name"
                                    name="name"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm"
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
                                  htmlFor="primaryContact"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Primary Contact Name
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    value={formState.primaryContact || ''}
                                    onChange={handleInputChange}
                                    id="primaryContact"
                                    name="primaryContact"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm"
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
                                    value={formState.phone || ''}
                                    onChange={handleInputChange}
                                    name="phone"
                                    id="phone"
                                    autoComplete="tel"
                                    placeholder="+1 (555) 123-4567"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm"
                                  />
                                  {errors.phone && (
                                    <p className="mt-1 text-xs text-red-500">
                                      {errors.phone}
                                    </p>
                                  )}
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
                                    value={formState.email || ''}
                                    onChange={handleInputChange}
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    placeholder="contact@vendor.com"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm"
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
                                    value={formState.specialization || ''}
                                    rows="3"
                                    placeholder="Brake parts, engine components..."
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="sm:col-span-2">
                                <button
                                  type="submit"
                                  disabled={formIsUnchanged()}
                                  className={`focus:border--[#2563eb] mt-4 rounded-md px-4 py-2 text-white focus:outline-none focus:ring focus:ring-[#2563eb] 
                                  ${
                                    formIsUnchanged()
                                      ? 'cursor-not-allowed bg-gray-500'
                                      : 'hover:bg--[#2563eb] bg-[#2563eb]'
                                  }`}
                                >
                                  {mode === 'edit' ? 'Update' : 'Add'}
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
      <Notification
        show={show}
        setShow={setShow}
        type={type}
        message={message}
      />
    </>
  )
}
