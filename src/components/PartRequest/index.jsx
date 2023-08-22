import PartRequestInfo from './PartRequestInfo';
import VendorResponseTable from './VendorResponseTable';

const PartRequestWithVendorResponses = ({ data }) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-md">
      <PartRequestInfo partRequest={data.partRequest} />
      <VendorResponseTable vendorResponses={data.vendorResponses} />
    </div>
  );
}

export default PartRequestWithVendorResponses;
