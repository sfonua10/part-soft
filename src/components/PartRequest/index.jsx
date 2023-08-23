"use client"
import { useState } from 'react'
import PartRequestInfo from './PartRequestInfo';
import VendorResponseTable from './VendorResponseTable';

const PartRequestWithVendorResponses = ({ data }) => {
  const [showTable, setShowTable] = useState(false);
  const toggleTableVisibility = () => {
    setShowTable((prevShowTable) => !prevShowTable);
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-md">
      <PartRequestInfo partRequest={data.partRequest} onToggleTable={toggleTableVisibility} isTableVisible={showTable} />
      {showTable && <VendorResponseTable vendorResponses={data.vendorResponses} />}
    </div>
  );
}

export default PartRequestWithVendorResponses;
