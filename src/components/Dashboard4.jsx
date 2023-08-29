"use client"
import useSWR from 'swr'
// import VendorTable from './VendorTable'
import VendorTable2 from './VendorTable2';

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

  // return <VendorTable data={workOrdersData} activeVendors={vendorData}/>
  return <VendorTable2 data={workOrdersData} />
}
