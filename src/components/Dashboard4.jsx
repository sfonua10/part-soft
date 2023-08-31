"use client"
import useSWR from 'swr'
import VendorTable2 from './VendorTable2';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Dashboard4() {
  // Fetching work orders data
  const { data: workOrdersData, error, isLoading: workOrdersLoading } = useSWR('/api/get-workorders', fetcher, {
    // refreshInterval: 5000
  });
  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  if (!workOrdersData || workOrdersData.length === 0) {
    return <div>No work orders available.</div>;
  }
  // return <VendorTable data={workOrdersData} activeVendors={vendorData}/>
  return <VendorTable2 data={workOrdersData} />
}
