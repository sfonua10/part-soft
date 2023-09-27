'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import VehicleInfo2 from '@/components/RequestPart/VehicleInfo2'
import { PlusCircleIcon } from '@heroicons/react/20/solid'
import PartRequestSection from '@/components/RequestPart/PartRequestSection'

export default function RequestPart() {
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
  })
  const [isQueueButtonDisabled, setIsQueueButtonDisabled] = useState(true)
  const [parts, setParts] = useState([{}])
  const [workOrderNumber, setWorkOrderNumber] = useState('')
  const [errors, setErrors] = useState({})
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const isAnyPartValid = parts.some((part) => {
      return part['part-name'] && part['part-number']
    })
    setIsQueueButtonDisabled(!(isAnyPartValid && workOrderNumber))
  }, [parts, workOrderNumber])

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
  const validateField = (fieldName, value) => {
    let error
    if (fieldName === 'work-order-number' && value.trim() === '') {
      error = 'Work Order Number is required'
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
  const handleRemovePart = (index) => {
    const newParts = parts.slice()
    newParts.splice(index, 1)
    setParts(newParts)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Validate work order number
    const workOrderNumberError = validateField(
      'work-order-number',
      workOrderNumber,
    )

    // Assuming you have validation functions for these fields as well
    // const vehicleError = validateVehicle(vehicle);
    // const partsError = validateParts(parts);
    // const vendorsError = validateVendors(vendors);

    // if (workOrderNumberError || vehicleError || partsError || vendorsError) {
    //     // Collect all errors into one object
    //     const newErrors = {
    //         workOrderNumber: workOrderNumberError,
    //         vehicle: vehicleError,
    //         parts: partsError,
    //         vendors: vendorsError,
    //     };

    //     // Update state with the new errors
    //     setErrors((prevErrors) => ({
    //         ...prevErrors,
    //         ...newErrors,
    //     }));

    //     return;
    // }

    // Construct the formData object
    const formData = {
      workOrderNumber,
      vehicle,
      parts: parts.map((part) => ({
        partName: part['part-name'],
        partNumber: part['part-number'],
      })),
      // vendors: vendors,
    }

    try {
      // setIsLoading(true);  // Assume setIsLoading is a function to toggle a loading state

      // Send the data to the server
      const response = await fetch('/api/part-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      // setIsLoading(false);

      // Handle the response
      const data = await response.json()
      if (!response.ok) {
        console.error('Server Error:', data.error)
        alert(data.error)
        return
      }

      // Reset specific fields
      setWorkOrderNumber('')
      setParts([
        {
          'part-name': '',
          'part-number': '',
        },
      ])

      router.push('/dashboard')
    } catch (error) {
      console.error('Error:', error)
      // setIsLoading(false);
    }
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Request Parts
        </h1>
        <form
          onSubmit={handleSubmit}
          className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
        >
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            <VehicleInfo2
              vehicle={vehicle}
              handleVehicleInputChange={handleVehicleInputChange}
              errors={errors}
              workOrderNumber={workOrderNumber}
              setWorkOrderNumber={setWorkOrderNumber}
              showAdditionalInfo={showAdditionalInfo}
              setShowAdditionalInfo={setShowAdditionalInfo}
            />
            <PartRequestSection
              parts={parts}
              handleInputChange={handleInputChange}
              handleRemovePart={handleRemovePart}
              errors={errors}
            />
            <section
              aria-labelledby="part-information-heading"
              className="mt-10 text-right"
            >
              <a
                href="#"
                onClick={addPart}
                className="flex items-center justify-end gap-1 text-sm font-semibold leading-6 text-gray-900"
              >
                Add Another Part{' '}
                <span aria-hidden="true">
                  <PlusCircleIcon className="h-6" />
                </span>
              </a>
            </section>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Parts summary
            </h2>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900">
                Work Order Number
              </h3>
              <p className="text-sm text-gray-600">
                {workOrderNumber || 'Not provided'}
              </p>
            </div>

            {/* Additional Vehicle Info */}
            {showAdditionalInfo && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Vehicle Information
                </h3>
                <dl className="mt-2 space-y-2">
                  {['vin', 'make', 'model', 'year'].map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <dt className="text-sm text-gray-600">
                        {field.toUpperCase()}
                      </dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {vehicle[field] || 'N/A'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {parts.map((part, index) => (
              <div key={index} className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Part #{index + 1}
                </h3>
                <dl className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Part Name</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {part['part-name'] || 'N/A'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Part Num.</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {part['part-number'] || 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isQueueButtonDisabled}
                className={`w-full rounded-md border border-transparent px-4 py-3 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isQueueButtonDisabled
                    ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-gray-50'
                }`}
              >
                Queue
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  )
}
