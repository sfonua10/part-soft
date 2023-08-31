'use client'

import { useState } from 'react'

const vendors = [
  { id: 1, name: 'Annette Black', active: true },
  { id: 2, name: 'Cody Fisher', active: false },
  { id: 3, name: 'Courtney Henry', active: true },
  { id: 4, name: 'Kathryn Murphy', active: false },
  { id: 5, name: 'Theresa Webb', active: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function VendorForm() {
  const [vendorList, setVendorList] = useState(vendors)

  const handleAddVendor = (e) => {
    e.preventDefault()
    // Logic to add the new vendor to some server or state
  }

  const handleSaveVendors = (e) => {
    e.preventDefault()
    const activeVendors = vendorList.filter((vendor) => vendor.active)
    // Here you can process the active vendors, like sending them to the server
    console.log(activeVendors)
  }

  const handleVendorToggle = (vendorId) => {
    const updatedVendors = vendorList.map((vendor) => {
      if (vendor.id === vendorId) {
        return { ...vendor, active: !vendor.active }
      }
      return vendor
    })
    setVendorList(updatedVendors)
  }

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Vendors</h2>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <form onSubmit={handleAddVendor}>
            <h2 className="text-lg font-medium text-gray-900">Add a Vendor</h2>
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
                    id="vendor-name"
                    name="vendor-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm"
                  />
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
                    id="primary-contact-name"
                    name="primary-contact-name"
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
                    name="phone"
                    id="phone"
                    autoComplete="tel"
                    placeholder="+1 (555) 123-4567"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm"
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
                    rows="3"
                    placeholder="Brake parts, engine components..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm"
                  ></textarea>
                </div>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="mt-4 rounded-md bg-[#2563eb] px-4 py-2 text-white hover:bg--[#2563eb] focus:border--[#2563eb] focus:outline-none focus:ring focus:ring-[#2563eb]"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>

          {/* Active VendorList */}
          <form onSubmit={handleSaveVendors} className="mt-10 lg:mt-0">
            <fieldset>
              <legend className="text-lg font-medium text-gray-900">
                My Vendors
              </legend>
              <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
                {vendorList.map((person, personIdx) => (
                  <div
                    key={person._id}
                    className="relative flex items-start py-4"
                  >
                    <div className="min-w-0 flex-1 text-sm leading-6">
                      <label
                        htmlFor={`person-${person._id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {person.name}
                      </label>
                    </div>
                    <div className="ml-3 flex h-6 items-center">
                      <input
                        id={`person-${person._id}`}
                        name={`person-${person._id}`}
                        type="checkbox"
                        checked={person.active}
                        onChange={() => handleVendorToggle(person.id)}
                        className="h-4 w-4 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-[#2563eb] px-4 py-2 text-white hover:bg--[#2563eb] focus:border--[#2563eb] focus:outline-none focus:ring focus:ring-[#2563eb]"
                >
                  Save
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  )
}
