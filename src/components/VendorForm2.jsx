'use client'
import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { mutate } from 'swr'
import AddVendorSliderOver from './AddVendorSlideOver'

export default function VendorForm2({ data }) {
  const checkbox = useRef()
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedPeople, setSelectedPeople] = useState(data || [])
  const [selectedVendor, setSelectedVendor] = useState({})
console.log('selectedPeople', selectedPeople)
  const addNewVendor = () => {
    setSelectedVendor({})
    setOpen(true)
  }
  useEffect(() => {
    if (data) {
      setSelectedPeople(data);
    }
  }, [data]);
  
  const deleteVendor = async (vendorToDelete) => {
    try {
      const response = await fetch('/api/delete-vendor', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorToDelete),
      })

      const responseData = await response.json()

      if (response.ok) {
        console.log('Successfully deleted vendor:', responseData)
        // Use mutate to re-fetch the data after successfully deleting a vendor
        mutate('/api/vendor-info')
      } else {
        console.error('Error deleting vendor:', responseData.message)
        // Handle the error in the UI, like showing an error message.
      }
    } catch (error) {
      console.error('Failed to delete vendor:', error)
      // Handle the error in the UI, like showing an error message.
    }
  }

  // useLayoutEffect(() => {
  //   const isIndeterminate =
  //     selectedPeople?.length > 0 && selectedPeople?.length < data?.length
  //   setChecked(selectedPeople?.length === data?.length)
  //   setIndeterminate(isIndeterminate)
  //   checkbox.current.indeterminate = isIndeterminate
  // }, [selectedPeople])

  // function toggleAll() {
  //   setSelectedPeople(checked || indeterminate ? [] : data)
  //   setChecked(!checked && !indeterminate)
  //   setIndeterminate(false)
  // }

  const toggleActiveStatus = (vendorId) => {
      // Toggle the vendor's isActive status
      const updatedPeople = selectedPeople.map(vendor => 
        vendor._id === vendorId ? { ...vendor, isActive: !vendor.isActive } : vendor
      );
    
      // Update the local state
      setSelectedPeople(updatedPeople);
  
      // Send the updated vendor to the database
      // updateVendorInDatabase(updatedVendor);
  }
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Vendors
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the Vendors in your account including their name,
              phone, email and primaryContact.{' '}
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={addNewVendor}
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Vendor
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="relative">
                {/* {selectedPeople?.length > 0 && (
                  <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                    <button
                      type="button"
                      className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    >
                      Bulk edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    >
                      Delete all
                    </button>
                  </div>
                )} */}
                <table className="min-w-full table-fixed divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="relative px-7 sm:w-12 sm:px-6 invisible"> {/**TODO: will make visible later */}
                        {/* <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          ref={checkbox}
                          checked={checked}
                          // onChange={toggleAll}
                        /> */}
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                      >
                        Vendor
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Phone
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Primary Contact
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Part Specialization
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {selectedPeople?.map((vendor) => (
                      <tr
                        key={vendor?.email}
                        className={
                          selectedPeople?.includes(vendor)
                            ? 'bg-gray-50'
                            : undefined
                        }
                      >
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          {selectedPeople?.includes(vendor) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                          )}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            value={vendor?.isActive}
                            checked={vendor.isActive}
                            onChange={() => toggleActiveStatus(vendor._id)}

                          />
                        </td>
                        {/* <td
                        className={classNames(
                          'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                          selectedPeople?.includes(vendor) ? 'text-indigo-600' : 'text-gray-900'
                        )}
                      >
                        {vendor?.name}
                      </td> */}
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                          {vendor.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {vendor.phone}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {vendor.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {vendor.primaryContact}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {vendor.specialization}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setSelectedVendor(vendor)
                              setOpen(true)
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit<span className="sr-only">, {vendor.name}</span>
                          </a>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              deleteVendor(vendor)
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                            <span className="sr-only">, {vendor.name}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddVendorSliderOver
        open={open}
        setOpen={setOpen}
        vendor={selectedVendor}
      />
    </>
  )
}
