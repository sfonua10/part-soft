'use client'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import VendorTable from './VendorTable'
import ReviewTable from './Dashboard/ReviewTable'
import PartsDisplay from './Dashboard/PartsDisplay'
// import OrganizationSelectModal from './Dashboard/OrganizationSelectModal'
import { fetcher } from '@/utils/fetcher'

export default function Dashboard() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  
  // Define the endpoint URL with the userId as a query parameter
  const endpointUrl = userId ? `/api/get-workorders?userId=${userId}` : null

  // Fetching work orders data
  const {
    data: workOrdersData,
    error,
    isLoading,
  } = useSWR(endpointUrl, fetcher, {
    refreshInterval: 30000,
  })
  
  if (error) {
    return <div>Error loading data: {error.message}</div>
  }

  if (!workOrdersData || workOrdersData.length === 0) {
    return <div>No work orders available.</div>
  }

  // const workOrdersAwaitingReview = workOrdersData.filter(
  //   (order) => order.status === 'Awaiting Parts Manager Review',
  // )

  return (
    <div>
      {/* <ReviewTable data={workOrdersAwaitingReview} /> */}
      {/* <VendorTable data={workOrdersData} /> */}
      {/* <OrganizationSelectModal /> */}
      <PartsDisplay data={workOrdersData} endpointUrl={endpointUrl} />
    </div>
  )
}
