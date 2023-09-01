"use client"
import useSWR from 'swr'
import VendorTable from './VendorTable';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  // Fetching work orders data
  const { data: workOrdersData, error, isLoading } = useSWR('/api/get-workorders', fetcher, {
    refreshInterval: 10000
  });
  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  if (!workOrdersData || workOrdersData.length === 0) {
    return <div>No work orders available.</div>;
  }
  return <VendorTable data={workOrdersData} />
}
