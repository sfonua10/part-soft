import React from 'react'

const PartRequestInfo = ({ partRequest }) => {
  return (
    <div className="mt-8 sm:flex sm:items-center">
    <div className="sm:flex-auto px-3">
      <h1 className="mb-2 text-lg font-semibold leading-7 text-gray-900">
        Work Order: {partRequest.workOrderNumber}
      </h1>
      <p className="mt-1 text-sm leading-5 text-gray-700">
        Part Name:{' '}
        <span className="font-medium">{partRequest.partName}</span>
      </p>
      <p className="mt-1 text-sm leading-5 text-gray-700">
        Year: <span className="font-medium">{partRequest.year}</span> | Vin:{' '}
        <span className="font-medium">{partRequest.vin}</span> | Make:{' '}
        <span className="font-medium">{partRequest.make}</span> | Model:{' '}
        <span className="font-medium">{partRequest.model}</span>
      </p>
    </div>
  </div>
    
  )
}

export default PartRequestInfo