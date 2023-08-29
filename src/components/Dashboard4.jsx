"use client"
import useSWR from 'swr'
import VendorTable from './VendorTable'
import VendorTable2 from './VendorTable2';
// import Vendor from '@/models/vendor';
import { myData } from '@/app/mockData/partRequest';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Dashboard4() {
  // Fetching vendor data
  const { data: vendorData, error: vendorError, isLoading: vendorLoading } = useSWR('/api/vendor-info?activeOnly=true', fetcher, {
    // refreshInterval: 1000
  })
  // Fetching work orders data
  const { data: workOrdersData, error: workOrdersError, isLoading: workOrdersLoading } = useSWR('/api/get-workorders', fetcher, {
    // refreshInterval: 1000
  });

  console.log('vendorData =====>', vendorData)
  console.log('workOrdersData =====>', workOrdersData)

  // return <VendorTable data={workOrdersData} activeVendors={vendorData}/>
  return <VendorTable2 data={workOrdersData} />
}

// import useSWR from 'swr'
// import VendorTable from './VendorTable'

// export default function Dashboard4() {
//   // Fetching vendor data
//   const { data: vendorData, error: vendorError, isLoading: vendorLoading } = useSWR('/api/vendor-info?activeOnly=true', fetcher, {
//     refreshInterval: 1000
//   });

//   // Fetching work orders data
//   const { data: workOrdersData, error: workOrdersError, isLoading: workOrdersLoading } = useSWR('/api/get-workorders', fetcher, {
//     refreshInterval: 1000
//   });

//   console.log('Vendor Data =====>', vendorData);
//   console.log('Work Orders Data =====>', workOrdersData);

//   // You can combine or process the two data sets as required for the VendorTable component or any other use

//   return <VendorTable data={myData} activeVendors={vendorData} workOrders={workOrdersData} />
// }
