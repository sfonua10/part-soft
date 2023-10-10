import React from 'react'
import Select from 'react-select'

const PartsList = ({ parts, allVendors, onVendorChange }) => {
  return (
    <div className="mt-6">
      <h2>Parts List</h2>
      <ul>
        {parts.map((part) => {
          return (
            <li key={part._id} className="mb-4">
              <div>
                {part.partName} - {part.partNumber}
              </div>
              <Select
                cacheOptions={false}
                isMulti
                options={allVendors}
                value={part.selectedVendors.map((vendor) => ({
                  label: vendor,
                  value: vendor,
                }))}
                onChange={(selected) => onVendorChange(selected, part._id)}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PartsList
