'use client'
import { useState } from 'react'
import PartRequestInfo from './PartRequestInfo'
import VendorResponseTable from './VendorResponseTable'

const PartRequestWithVendorResponses = ({ data }) => {
  const [showTable, setShowTable] = useState(false)
  const toggleTableVisibility = () => {
    setShowTable((prevShowTable) => !prevShowTable)
  }
  return (
    <div className="rounded-md border border-gray-200 px-4 sm:px-6 lg:px-8">
      <PartRequestInfo
        partRequest={data}
        onToggleTable={toggleTableVisibility}
        isTableVisible={showTable}
      />
      {showTable && <VendorResponseTable vendorResponses={data.vendorResponses} />}
    </div>
  )
}

export default PartRequestWithVendorResponses
