import React from 'react'

const page = () => {
    // const handleRequestPart = async () => {
    //     const formData = {
    //       workOrderNumber: workOrderNum,
    //       vehicle,
    //       parts: parts.map((part) => ({
    //         partName: part.partName,
    //         partNumber: part.partNumber,
    //         // selectedVendors: part.selectedVendors,
    //       })),
    //       // vendors: vendors,
    //     }
    
    //     try {
    //       setIsLoading(true)
    
    //       const response = await fetch('/api/send-sms-2', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(formData),
    //       })
    
    //       const data = await response.json()
    //       if (!response.ok) {
    //         console.error('Server Error:', data.error)
    //         alert(data.error)
    //         setIsLoading(false)
    //         return
    //       } else if (data.success) {
    //         router.push('/dashboard')
    //       }
    
    //       setWorkOrderNum('')
    //       setParts([
    //         {
    //           'part-name': '',
    //           'part-number': '',
    //         },
    //       ])
    //       setVehicle({
    //         make: '',
    //         model: '',
    //         year: '',
    //         vin: '',
    //       })
    //       setIsLoading(false)
    //     } catch (error) {
    //       console.error('Error:', error)
    //       setIsLoading(false)
    //     }
    //   }
  return (
    <div>review message and send</div>
  )
}

export default page