"use client"
import useSWR from 'swr'

import VendorTable from './VendorTable'

// const people = [
//   {
//     name: 'Vriens Truck Parts',
//     partAvailability: 'Available',
//     price: '$49.99',
//     orderStatus: 'In Will Call',
//   },
//   {
//     name: 'Freedom Truck & Trailer Parts',
//     partAvailability: 'Available',
//     price: '$29.99',
//     orderStatus: 'Delivered',
//   },
//   {
//     name: 'Rocky Mountain Truck Parts',
//     partAvailability: 'Not Available',
//     price: '$47.99',
//     orderStatus: 'Out For Delivery',
//   },
//   // More people...
// ]
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Dashboard4() {
  const { data, error, isLoading } = useSWR('/api/vendor-info', fetcher, {
    refreshInterval: 1000
  })
  console.log('data =====>', data)
  return <VendorTable data={data} />
}
