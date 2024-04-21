'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import AdditionalVehicleInfo from '@/components/RequestPart/AdditionalVehicleInfo'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import PartRequestSection from '@/components/RequestPart/PartRequestSection'
import SuccessModal from '@/components/RequestPart/SuccessModal'
import Summary from '@/components/Summary'
import { useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: session } = useSession()

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

    setVehicle((prev) => ({ ...prev, [name]: value }))

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

    const newParts = [...parts]
    newParts[index][name] = value
    setParts(newParts)

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

  const createWorkorder = useMutation(api.workorders.createWorkorder)

  const handleSubmit = async (event) => {
    event.preventDefault()
    await createWorkorder({
      orgId: session?.user?.organizationId,
      workOrderNumber,
      parts: parts.map((part) => ({
        partName: part['part-name'],
        partNumber: part['part-number'],
      })),
      mechanicName: session?.user?.name,
    })
    const formData = {
      organizationId: session?.user?.organizationId,
      workOrderNumber,
      vehicle,
      parts: parts.map((part) => ({
        partName: part['part-name'],
        partNumber: part['part-number'],
      })),
      mechanicName: session?.user?.name,
    }

    try {
      const response = await fetch('/api/work-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (!response.ok) {
        console.error('Server Error:', data.error)
        alert(data.error)
        return
      }

      setWorkOrderNumber('')
      setParts([
        {
          'part-name': '',
          'part-number': '',
        },
      ])
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Request Parts
        </h1>
        {isModalOpen && (
          <SuccessModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
        >
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            <AdditionalVehicleInfo
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
                className="flex items-center justify-end gap-1 text-sm font-semibold leading-6 text-blue-500 hover:text-blue-600"
              >
                Add Another Part{' '}
                <span aria-hidden="true">
                  <PlusCircleIcon className="h-6" />
                </span>
              </a>
            </section>
          </section>

          {/* Order summary */}
          <Summary
            workOrderNumber={workOrderNumber}
            vehicle={vehicle}
            parts={parts}
            showAdditionalInfo={showAdditionalInfo}
            isQueueButtonDisabled={isQueueButtonDisabled}
          />
        </form>
      </div>
    </div>
  )
}
