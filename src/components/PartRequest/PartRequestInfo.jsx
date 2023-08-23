// In PartRequestInfo.js
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'
import React from 'react'

const PartRequestInfo = ({ partRequest, onToggleTable, isTableVisible }) => {
  return (
    <div className="pb-4 pt-4 sm:flex sm:items-center">
      <div className="flex items-center justify-between px-3 sm:flex-auto">
        <p className="text-sm leading-5 text-gray-700">
          Work Order Number:{' '}
          <span className="font-medium">{partRequest.workOrderNumber}</span> |
          Part Name: <span className="font-medium">{partRequest.partName}</span>{' '}
          | Part Number:{' '}
          <span className="font-medium">{partRequest.partNumber}</span> | Year:{' '}
          <span className="font-medium">{partRequest.year}</span> | Vin:{' '}
          <span className="font-medium">{partRequest.vin}</span> | Make:{' '}
          <span className="font-medium">{partRequest.make}</span> | Model:{' '}
          <span className="font-medium">{partRequest.model}</span>
        </p>

        <button onClick={onToggleTable} className="ml-4 inline-flex">
          {isTableVisible ? (
            <>
              <ArrowUpIcon className="h-5 w-5" />
              <span className="mr-1">Hide</span>
            </>
          ) : (
            <>
              <ArrowDownIcon className="h-5 w-5" />
              <span className="mr-1">Show</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default PartRequestInfo
