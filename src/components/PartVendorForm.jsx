'use client'
import React, { useState, useEffect } from 'react'

const PartVendorForm = () => {
  const [formData, setFormData] = useState({
    available: '',
    price: '',
  })
  const [partDetails, setPartDetails] = useState({})
  const [successData, setSuccessData] = useState({
    message: '',
    available: '',
    price: '',
  })

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const partName = queryParams.get('partName')
    const partNumber = queryParams.get('partNumber')
    const workOrderNumber = queryParams.get('workOrderNumber')
    const organizationName = queryParams.get('organizationName')
    const vendorName = queryParams.get('vendorName')
    const partId = queryParams.get('partId')
    // Add other parameters as needed

    setPartDetails({
      workOrderNumber,
      partName,
      partNumber,
      organizationName,
      vendorName,
      partId,
      // ... other details
    })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  const resetForm = () => {
    setSuccessData({ message: '', available: '', price: '' })
    setFormData({ available: '', price: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/update-vendor-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          workOrderNumber: partDetails.workOrderNumber,
          partId: partDetails.partId,
          vendorName: partDetails.vendorName,
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      // Handle success response
      setSuccessData({
        message: 'Thank you for your response.',
        available: formData.available,
        price: formData.available === 'yes' ? formData.price : '',
      })
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
      if (error instanceof Error) {
        // Additional error logging here
        console.error('Error message:', error.message)
      }
    }
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <section className="sm:mx-auto sm:w-full sm:max-w-md">
          <header className="text-center">
            <h2 className="text-left text-2xl font-bold text-gray-900">
              {partDetails.vendorName}, do you have this part for{' '}
              {partDetails.organizationName}
            </h2>
          </header>

          <main>
            <div className="mt-4 text-center">
              <h3 className="text-left text-lg font-medium text-gray-700">
                Part Name: {partDetails.partName}
              </h3>
              <p className="text-left text-lg font-medium text-gray-600">
                Part Number: {partDetails.partNumber}
              </p>

              {partDetails.imageUrl && (
                <figure>
                  <img
                    src={partDetails.imageUrl}
                    alt={`Image of ${partDetails.partName}`}
                    className="mx-auto h-40 w-auto object-cover"
                  />
                  <figcaption className="text-sm">
                    Image of {partDetails.partName}
                  </figcaption>
                </figure>
              )}
            </div>

            {successData.message ? (
              <div className="my-4 rounded-md bg-green-100 p-4 text-center text-green-800">
                {successData.message}
                <div>
                  <p>
                    Availability:{' '}
                    {successData.available === 'yes' ? 'Yes' : 'No'}
                  </p>
                  {successData.available === 'yes' && (
                    <p>Price: ${successData.price}</p>
                  )}
                  <button
                    onClick={resetForm}
                    className="mt-4 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Update Response
                  </button>{' '}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <div>
                  <label
                    htmlFor="available"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Available
                  </label>
                  <div className="mt-2">
                    <select
                      id="available"
                      name="available"
                      value={formData.available}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Select Availability</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                {formData.available === 'yes' && (
                  <div className="relative mt-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </span>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder="Enter price"
                      required
                      className="block w-full rounded-md border-0 py-1.5 pl-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </main>
        </section>
      </div>
    </>
  )
}

export default PartVendorForm
