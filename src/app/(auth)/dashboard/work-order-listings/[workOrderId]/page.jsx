'use client'
import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import VehicleInfo from '@/components/RequestPart/VehicleInfo'
import PartsList from '@/components/WorkOrderListings/PartsList'

const fetcher = (url) => fetch(url).then((res) => res.json())

const WorkOrderDetailsPage = ({ params }) => {
  const workOrderNumber = params.workOrderId
  const { data: workOrder, error } = useSWR(
    workOrderNumber
      ? `/api/get-workorders?workOrderId=${workOrderNumber}`
      : null,
    fetcher,
    { revalidateOnFocus: false },
  )
  const { data: vendorData } = useSWR('/api/vendor-info', fetcher, {
    revalidateOnFocus: false,
  })

  // Maintain a state for the vehicle information and work order number
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
  })
  const [workOrderNum, setWorkOrderNum] = useState('')
  const [parts, setParts] = useState([])
  const [vendors, setVendors] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (workOrder) {
      const initialParts = workOrder.parts.map((part) => ({
        ...part,
        selectedVendors: part.selectedVendors || [],
      }))
      setVehicle(workOrder.vehicle)
      setWorkOrderNum(workOrder.workOrderNumber)
      setParts(initialParts)
    }
  }, [workOrder])

  useEffect(() => {
    if (vendorData) {
      const transformedVendors = vendorData.map((vendor) => ({
        label: vendor.name,
        value: vendor._id,  // <-- Change value to vendor's _id for uniqueness
        data: vendor  // <-- Store the entire vendor object here
      }));
      setVendors(transformedVendors);
    }
  }, [vendorData]);
  

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target
    setVehicle((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleVendorChange = (selectedVendors, partId) => {
    console.log('Handling vendor change for part:', partId);  // Logs the part ID for which vendors are being changed
    console.log('Selected vendors:', selectedVendors);  // Logs the vendors selected (probably before they're processed)

    setParts((prevParts) => {
      const updatedParts = prevParts.map((part) => {
        if (part._id === partId) {
          const vendorsForPart = selectedVendors.map((selectedVendor) => {
            const vendor = vendorData.find(v => v._id === selectedVendor.value);
            return vendor;  // <-- Store the entire vendor object
          });

          console.log('Vendors mapped for part', partId, ':', vendorsForPart);  // Logs the processed vendor objects for the specific part

          return {
            ...part,
            selectedVendors: vendorsForPart,
          };
        }
        return part;
      });

      console.log('Updated parts after vendor selection:', updatedParts);  // Logs the entire parts list after the change
      return updatedParts;
    });
};

  

  const handleUpdateWorkOrder = async () => {
    try {
      const response = await fetch('/api/update-workorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: workOrder._id,
          vehicle: vehicle,
          status: 'Vehicle Details Added',
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Handle success - maybe show a notification or refresh the data
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Failed to update:', error)
    }
  }

  const handleRequestPart = async () => {
    console.log('handleRequestPart called');

    // const hasErrors = Object.values(errors).some((partErrors) =>
    //   Object.values(partErrors).some((errorMessage) => errorMessage !== ''),
    // )

    // if (hasErrors) {
    //   alert('Please correct the errors before submitting.')
    //   return
    // }

    const formData = {
      workOrderNumber: workOrderNum,
      vehicle,
      parts: parts.map((part) => ({
        partName: part.partName,
        partNumber: part.partNumber,
        selectedVendors: part.selectedVendors,
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

      const data = await response.json()
      if (!response.ok) {
        console.error('Server Error:', data.error)
        alert(data.error)
        setIsLoading(false)
        return
      }

      setWorkOrderNum('')
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
      setIsLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    handleUpdateWorkOrder()
  }

  if (error) return <div>Error loading work order</div>
  if (!workOrder) return <div>Loading...</div>
  const baseButtonStyles =
    'w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm hover:bg--[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto'
  const getButtonStyles = (condition) => {
    return `${baseButtonStyles} ${
      condition
        ? 'bg-[#2563eb] text-white'
        : 'cursor-not-allowed bg-[#2563eb] opacity-50'
    }`
  }
  const isFormFilled = () => {
    return vehicle.make && vehicle.model && vehicle.year && vehicle.vin
  }
  const allPartsHaveVendors = () => {
    return parts.every(
      (part) => part.selectedVendors && part.selectedVendors.length > 0,
    )
  }

  return (
    <div>
      <h1>Work Order Details Page {workOrderNumber}</h1>
      <form onSubmit={handleFormSubmit}>
        <VehicleInfo
          vehicle={vehicle}
          handleVehicleInputChange={handleVehicleInputChange}
          errors={{}} // TODO: manage errors
          workOrderNumber={workOrderNum}
          setWorkOrderNumber={setWorkOrderNum}
        />
        <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={!isFormFilled()}
            className={getButtonStyles(isFormFilled())}
          >
            Update Vehicle
          </button>
        </div>
      </form>
      <PartsList
        parts={parts}
        allVendors={vendors}
        onVendorChange={handleVendorChange}
      />
      <button
        type="button"
        disabled={!allPartsHaveVendors() || !isFormFilled()}
        className={getButtonStyles(allPartsHaveVendors() && isFormFilled())}
        onClick={handleRequestPart}
      >
        Request Part
      </button>
    </div>
  )
}

export default WorkOrderDetailsPage
