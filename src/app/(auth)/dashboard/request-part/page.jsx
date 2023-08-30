'use client'

import { useState, useEffect, useMemo } from 'react'
import useSWR, { mutate } from 'swr'
import Notification from '@/components/Notification'
import SplitBackground from '@/components/RequestPart/SplitBackground'
import PartRequestSection from '@/components/RequestPart/PartRequestSection'
import VehicleInfo from '@/components/RequestPart/VehicleInfo'
import VendorSection from '@/components/RequestPart/VendorSection'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function RequestPart() {
  const { data: vendors, error } = useSWR('/api/vendor-info', fetcher, {
    revalidateIfStale: true,
  })
  const [myVendors, setMyVendors] = useState([])
  const [parts, setParts] = useState([{}])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [workOrderNumber, setWorkOrderNumber] = useState('')
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
  })
  const [hasVendorChanges, setHasVendorChanges] = useState(false)
  const [vendorChangesSaved, setVendorChangesSaved] = useState(false)
  const [notification, setNotification] = useState({
    show: false,
    type: 'success',
    message: '',
  })
  const [isFormFilled, setIsFormFilled] = useState(false)

  useEffect(() => {
    setIsFormFilled(isFormValid())
  }, [workOrderNumber, vehicle, parts])
  // Update myVendors once vendors is loaded
  useEffect(() => {
    if (vendors) {
      setMyVendors(vendors)
    }
  }, [vendors])
  const isFormValid = () => {
    // Ensure the vehicle details are filled out
    const vehicleValid =
      workOrderNumber &&
      vehicle.vin &&
      vehicle.make &&
      vehicle.model &&
      vehicle.year

    // Ensure at least one part request is filled out with both name and number
    const atLeastOnePartValid = parts.some(
      (part) => part['part-name'] && part['part-number'],
    )

    return vehicleValid && atLeastOnePartValid
  }
  const addPart = (e) => {
    e.preventDefault()
    setParts([...parts, {}])
  }
  
  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target
    const error = validateField(name, value)

    // Update the vehicle state with the new value
    setVehicle((prev) => ({ ...prev, [name]: value }))

    // Update the errors state for vehicle fields
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }))
  }

  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'work-order-number':
      case 'vin':
      case 'make':
      case 'model':
        if (!value.trim()) error = 'This field is required'
        break
      case 'year':
        if (!/^\d{4}$/.test(value)) error = 'Year should be a 4-digit number'
        break
      case 'vin':
        if (value.length !== 17) error = 'VIN should be 17 characters long'
        break
      default:
        break
    }
    return error
  }

  const handleInputChange = (e, index) => {
    const { name, value } = e.target
    const error = validateField(name, value)

    // Update the parts state with the new value
    const newParts = [...parts]
    newParts[index][name] = value
    setParts(newParts)

    // Update the errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [index]: {
        ...(prevErrors[index] || {}),
        [name]: error,
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const hasErrors = Object.values(errors).some((partErrors) =>
      Object.values(partErrors).some((errorMessage) => errorMessage !== ''),
    )

    if (hasErrors) {
      alert('Please correct the errors before submitting.')
      return
    }

    const formData = {
      workOrderNumber,
      vehicle, // Adding vehicle details separately
      parts: parts.map((part, index) => ({
        partName: part['part-name'],
        partNumber: part['part-number'],
      })),
      vendors: vendors,
    }

    try {
      setIsLoading(true)

      const response = await fetch('/api/send-sms-2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      setIsLoading(false)

      const data = await response.json()
      if (!response.ok) {
        console.error('Server Error:', data.error) // Assuming your API returns an error field
        alert(data.error)
        setIsLoading(false)
        return
      }
      setWorkOrderNumber('')
      setParts([
        {
          'part-name': '',
          'part-number': '',
        },
      ])
      setVehicle({
        make: '',
        model: '',
        year: '',
        vin: '',
      })
    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
    }
  }

  const handleCheckboxChange = (vendorId) => {
    // Update the specific vendor's isActive status in myVendors
    const updatedVendors = myVendors.map((vendor) =>
      vendor._id === vendorId
        ? { ...vendor, isActive: !vendor.isActive }
        : vendor,
    )

    setMyVendors(updatedVendors)

    // Check if there's any change between vendors and updatedVendors
    const changeDetected = updatedVendors.some(
      (vendor, index) => vendor.isActive !== vendors[index].isActive,
    )

    setHasVendorChanges(changeDetected)
  }

  function saveSelections() {
    // Filter out only those vendors whose isActive status has changed
    const changedVendors = myVendors.filter((myVendor, index) => {
      const originalVendor = vendors.find((v) => v._id === myVendor._id)
      return originalVendor && originalVendor.isActive !== myVendor.isActive
    })

    // Update the isSaved status for each changed vendor
    const updatedVendors = changedVendors.map((vendor) => ({
      ...vendor,
      isSaved: vendor.isActive,
    }))
    // If no vendors changed, then don't make an API call
    if (updatedVendors.length === 0) {
      console.log('No changes detected')
      return
    }
    // Make an API call to save these changes
    fetch('/api/save-vendor-status', {
      method: 'PUT',
      body: JSON.stringify(updatedVendors),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok') // If HTTP status is not in the 200-299 range
        }
        return response.json()
      })
      .then((data) => {
        if (data.success) {
          // mutate('/api/save-vendor-status')
          mutate('/api/vendor-info')
          setNotification({
            show: true,
            type: 'success',
            message: data.message,
          })
          setVendorChangesSaved(true)
        } else {
          setNotification({
            show: true,
            type: 'error',
            message: data.message || 'Something went wrong. Please try again.',
          })
        }
        setHasVendorChanges(false)
      })
      .catch((error) => {
        console.error('Error:', error)
        setNotification({
          show: true,
          type: 'error',
          message: 'An unexpected error occurred. Please try again.',
        })
      })
  }
  const baseButtonStyles =
    'w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto'
  const isRequestPartEnabled =
    isFormFilled && myVendors.some((vendor) => vendor.isSaved)

  const getButtonStyles = (condition) => {
    return `${baseButtonStyles} ${
      condition
        ? 'bg-indigo-600 text-white'
        : 'cursor-not-allowed bg-indigo-300 opacity-50'
    }`
  }

  return (
    <div className="bg-white">
      {/* Background color split screen for large screens */}
      <SplitBackground />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
        <h1 className="sr-only">Part request information</h1>
        <VendorSection
          myVendors={myVendors}
          handleCheckboxChange={handleCheckboxChange}
          saveSelections={saveSelections}
          hasVendorChanges={hasVendorChanges}
        />
        <Notification
          show={notification.show}
          type={notification.type}
          message={notification.message}
          setShow={(show) => setNotification((prev) => ({ ...prev, show }))}
        />
        <form
          onSubmit={handleSubmit}
          className="px-4 pb-36 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <VehicleInfo
              vehicle={vehicle}
              handleVehicleInputChange={handleVehicleInputChange}
              errors={errors}
              workOrderNumber={workOrderNumber}
              setWorkOrderNumber={setWorkOrderNumber}
            />
            <PartRequestSection
              parts={parts}
              handleInputChange={handleInputChange}
              errors={errors}
            />
            <section
              aria-labelledby="part-information-heading"
              className="mt-10 text-right"
            >
              <a
                href="#"
                onClick={addPart}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Add Another Part <span aria-hidden="true">→</span>
              </a>
            </section>

            <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={!isRequestPartEnabled || !isFormFilled}
                className={getButtonStyles(
                  isRequestPartEnabled && isFormFilled,
                )}
              >
                Request Part
              </button>
              <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left">
                {vendorChangesSaved
                  ? 'Ensure vendor changes are saved before requesting a part.'
                  : 'Vendor changes detected. Save them first!'}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
